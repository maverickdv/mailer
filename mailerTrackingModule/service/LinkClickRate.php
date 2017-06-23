<?php 

namespace MailTracking\Service;

class LinkClickRate implements ServiceInterface{
	private $linkModifier;

	public function __construct($linkModifierUtility){
		$this->linkModifier = $linkModifierUtility;
	}

	public function execute($commonParams, $params, $body , $mailId){
		$proxyLink = $commonParams["mailerDomain"];
		$excludeLinks = $params["excludedLinks"] ;
		// two different times for mailer id
		$body = $this->linkModifier->replaceLinks($proxyLink , $excludeLinks , $body , $mailId );
		return $body;
	}
}
