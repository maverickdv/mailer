<?php

namespace MailTracking\Core;

use MailTracking\Utility\MailIdGenerator as MailIdGenerator;
use MailTracking\Config\TrackingConstants as TrackingConstants;
use MailTracking\Exception\MailTrackingServiceNotFoundException as MailTrackingServiceNotFoundException;
use MailTracking\Exception\MailTrackingInvalidAppId as MailTrackingInvalidAppId;
use MailTracking\Exception\MailTrackingInvalidEnvironment as MailTrackingInvalidEnvironment;
use MailTracking\Exception\MailTrackingInsufficientMandatoryParams as MailTrackingInsufficientMandatoryParams;
use MailTracking\Exception\MailTrackingAsyncRequestFailed as MailTrackingAsyncRequestFailed;
use MailTracking\Exception\MailTrackingBodyEmptyException as MailTrackingBodyEmptyException;

class MailTracker{
	private $trackingFactory;
	private $trackingConfig;

	public function __construct($trackingFactory, $trackingConfig){ 
		$this->trackingFactory = $trackingFactory;
		$this->trackingConfig = $trackingConfig;
	}

	public function initiateTracking($allParams , $body){
		try{
			if($body == ""){
				throw new MailTrackingBodyEmptyException(TrackingConstants::BODY_EMPTY_EXCEPTION_MSG);
			}
			$commonParams = $allParams["commonParams"];
			$trackingParams = $allParams["trackingParams"];
			$mailId = $this->generateUniqueMailId($commonParams);
			$mailerDomainUrl = $this->getMailerDomainUrl($commonParams["appId"] , $commonParams["env"]);
			$commonParams["mailerDomain"] = $mailerDomainUrl;
			$body = $this->doTrackingWork($trackingParams , $commonParams , $body , $mailId);
			$this->sendRequestForMailLogging($commonParams , $mailId);
			return $body;
		}
		catch(MailTrackingBodyEmptyException $e){
			echo $e->getMessage();
			die;
		}
		catch(MailTrackingServiceNotFoundException $e){
			echo $e->getMessage();
			die;
		}
		catch(MailTrackingInvalidAppId $e){
			echo $e->getMessage();
			die;	
		}
		catch(MailTrackingInvalidEnvironment $e){
			echo $e->getMessage();
			die;	
		}
		catch(MailTrackingInsufficientMandatoryParams $e){
			echo $e->getMessage();
			die;	
		}
		catch(MailTrackingAsyncRequestFailed $e){
			echo true;
//			die;
		}
	}

	private function getMailerDomainUrl($appId, $env){
		if(preg_match(TrackingConstants::NAUKRI_APPID_REGEX , $appId)){
			$domainKey = TrackingConstants::NAUKRI_DOMAIN_ID;
		}
		elseif(preg_match(TrackingConstants::NAUKRIGULF_APPID_REGEX , $appId)){
			$domainKey = TrackingConstants::NAUKRIGULF_DOMAIN_ID;	
		}
		elseif(preg_match(TrackingConstants::FIRSTNAUKRI_APPID_REGEX , $appId)){
			$domainKey = TrackingConstants::FIRSTNAUKRI_DOMAIN_ID;	
		}
		else{
			throw new MailTrackingInvalidAppId(TrackingConstants::APPID_EXCEPTION_MSG);
		}
		if(!in_array($env , TrackingConstants::$ALLOWED_ENVIRONMENTS)){
			throw new MailTrackingInvalidEnvironment(TrackingConstants::ENVIRONMENT_EXCEPTION_MSG);
		}
		return $this->trackingConfig[$env][$domainKey];
	}

	private function generateUniqueMailId($commonParams){
		$countParams = 0;
		foreach(TrackingConstants::$MANDATORY_PARAMS_FOR_MAILID as $mandatoryField){
			if(array_key_exists($mandatoryField , $commonParams)){
				$countParams++;
				continue;
			}
		}
		if($countParams < count(TrackingConstants::$MANDATORY_PARAMS_FOR_MAILID)){
			throw new MailTrackingInsufficientMandatoryParams(TrackingConstants::INSUFFICIENT_MANDATORY_PARAMS_EXCEPTION_MSG);
		}
		$appId = $commonParams["appId"];
		$userId = $commonParams["userId"];
		$mailerId = $commonParams["mailerId"];
		$email = $commonParams["email"];
		$mailIdGenerator = $this->trackingFactory->createMailIdGeneratorUtilityObject();
		$mailId = $mailIdGenerator->generateUniqueId($appId , $userId , $mailerId , $email);
		return $mailId;
	}
	

	private function doTrackingWork($trackingParams , $commonParams , $body , $mailId){
		foreach($trackingParams as $trackingType => $params){
			$serviceTypeObj = $this->trackingFactory->createServiceTypeObject($trackingType);
			$body = $serviceTypeObj->execute($commonParams , $params , $body , $mailId);
		}
		return $body;
	}

	private function sendRequestForMailLogging($commonParams, $mailId){
		$trakingDetailSenderObj = $this->trackingFactory->createServiceTypeObject("asynRequestSender");
		$fields = array("appId" => $commonParams["appId"] , "uniMailId" => $mailId , "mailerType" => $commonParams["mailerId"] , "email" => $commonParams["email"] , "userId" => $commonParams["userId"]);
		$trakingDetailSenderObj->sendRequest($fields , $commonParams["mailerDomain"]);
	}


}
