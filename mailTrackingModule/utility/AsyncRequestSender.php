<?php
namespace MailTracking\Utility;

use MailTracking\Config\TrackingConstants as TrackingConstants;

class AsyncRequestSender{

	public $curlOptions; 

	public function __construct(){
		$this->curlOptions = array(
				CURLOPT_URL => TrackingConstants::MAIL_DETAILS_TRACKING_URL,
				CURLOPT_POST => 1,
				CURLOPT_TIMEOUT_MS => TrackingConstants::CURL_TIMEOUT_IN_MS
				//CURLOPT_NOSIGNAL => 1
				);
	}

	public function makeRequest($fields){
		$curl = curl_init();
		$this->curlOptions[CURLOPT_POSTFIELDS] = http_build_query( $fields );
		curl_setopt_array( $curl, $this->curlOptions );
		$result = curl_exec( $curl );
		curl_close( $curl );
	} 
}
