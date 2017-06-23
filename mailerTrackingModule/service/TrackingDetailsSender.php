<?php

namespace MailTracking\Service;

class TrackingDetailsSender {

	private $httpClient;
	public function __construct($asyncRequestUtiltiy){
		$this->httpClient = $asyncRequestUtiltiy;
	}

	public function sendRequest($fields , $mailerDomain){
		$this->httpClient->makeRequest($fields , $mailerDomain);
	}
		
}
