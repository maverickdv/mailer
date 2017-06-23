<?php

namespace MailTracking\Utility;

use MailTracking\Config\TrackingConstants as TrackingConstants;
use MailTracking\Exception\MailTrackingAsyncRequestFailed as MailTrackingAsyncRequestFailed;

class AsyncRequestSender{

	public $curlOptions; 

	public function __construct(){
		$this->curlOptions = array(
//				CURLOPT_URL => TrackingConstants::TRACKING_URL."/handler.php",
				CURLOPT_POST => 1,
				CURLOPT_TIMEOUT_MS => TrackingConstants::CURL_TIMEOUT_IN_MS
				//CURLOPT_NOSIGNAL => 1
				);
	}

	public function makeRequest($fields , $mailerDomain){
		try{
			$curl = curl_init();
			$this->setDynamicHeader($fields, $mailerDomain);
			curl_setopt_array( $curl, $this->curlOptions );
			$result = curl_exec( $curl );
			curl_close( $curl );
		}
		catch(Exception $e){
			throw new MailTrackingAsyncRequestFailed(TrackingConstants::ASYNC_REQUEST_FAILED_EXCEPTION_MSG);
		}
	} 

	private function setDynamicHeader($fields , $mailerDomain){
		$mailerDomain = '127.0.0.1:8084';
		$this->curlOptions[CURLOPT_URL] = $mailerDomain."/".TrackingConstants::MAIL_DETAILS_TRACKING_URL;
		$this->curlOptions[CURLOPT_POSTFIELDS] = http_build_query( $fields );
	}
}
