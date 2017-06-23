<?php 

namespace MailTracking\Service;

class OpenRate implements ServiceInterface{
	private $pixelAdderUtilty;
//	private $mailIdGeneratorUtilty;

	public function __construct($pixelAdderUtility ){// , $mailIdGeneratorUtility){
		$this->pixelAdderUtilty = $pixelAdderUtility;
//		$this->mailIdGeneratorUtilty = $mailIdGeneratorUtility;
	}

        public function execute($commonParams , $params , $body , $mailId){
		//generate mail id
//		$userId = $commonParams["userId"];
//		$mailerId = $commonParams["mailerId"];
//		$appId = $commonParams["appId"];
//		$mailId = $this->mailIdGeneratorUtilty->generateUniqueId($appId,$userId,$mailerId);
                $domain = $commonParams["mailerDomain"];
                return $this->pixelAdderUtilty->addPixel($domain,$mailId,$body);
        }
}
