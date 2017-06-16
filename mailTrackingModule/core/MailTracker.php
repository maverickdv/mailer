<?php

namespace MailTracking\Core;

use MailTracking\Utility\MailIdGenerator as MailIdGenerator;
use MailTracking\Exception\MailTrackingServiceNotFoundException as MailTrackingServiceNotFoundException;

class MailTracker{
	private $trackingFactory;

	public function __construct($trackingFactory ){ 
		$this->trackingFactory = $trackingFactory;
	}

	public function initiateTracking($allParams , $body){
		try{
			$commonParams = $allParams["commonParams"];
			$trackingParams = $allParams["trackingParams"];
			$mailId = $this->generateUniqueMailId($commonParams);
			$body = $this->doTrackingWork($trackingParams , $commonParams , $body , $mailId);
			$this->sendRequestForMailLogging($commonParams , $mailId);
			return $body;
		}
		catch(MailTrackingServiceNotFoundException $e){
			echo $e->getMessage();
			die;
		}
	}

	private function generateUniqueMailId($commonParams){
		$appId = $commonParams["appId"];
		$userId = $commonParams["userId"];
		$mailerId = $commonParams["mailerId"];
		$mailIdGenerator = $this->trackingFactory->createMailIdGeneratorUtilityObject();
		$mailId = $mailIdGenerator->generateUniqueId($appId , $userId , $mailerId);
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
		$trakingDetailSenderObj->sendRequest($fields);
	}


}
