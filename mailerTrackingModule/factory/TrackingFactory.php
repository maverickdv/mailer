<?php

namespace MailTracking\Factory;

use MailTracking\Service\LinkClickRate as LinkClickRate;
use MailTracking\Service\OpenRate as OpenRate;
use MailTracking\Service\TrackingDetailsSender as TrackingDetailsSender;
use MailTracking\Utility\TrackingLinkModifier as TrackingLinkModifier;
use MailTracking\Utility\PixelAdder as PixelAdder;
use MailTracking\Utility\MailIdGenerator as MailIdGenerator;
use MailTracking\Utility\AsyncRequestSender as AsyncRequestSender;
use MailTracking\Exception\MailTrackingServiceNotFoundException as MailTrackingServiceNotFoundException;
use MailTracking\Config\TrackingConstants as TrackingConstants;

class TrackingFactory{
    private static $instance;

    public static function getInstance() {
        if(! isset(self::$instance)) {
            $class = __CLASS__;
            self::$instance = new $class();
        }
        return self::$instance;
    }

    private function __construct() {

    }

    public function createServiceTypeObject($trackingType){
	switch($trackingType){
		case "openRate":
			$serviceObject = $this->createOpenRateServiceObject();
			break;
		case "linkClickRate":
			$serviceObject = $this->createLinkClickRateServiceObject();
			break;
		case "asynRequestSender":
			$serviceObject = $this->createTrackingDetailsSenderServiceObject();
			break;
		default:
			throw new MailTrackingServiceNotFoundException(TrackingConstants::SERVICE_EXCEPTION_MSG);
	}
	return $serviceObject;
    }

    private function createOpenRateServiceObject(){
        $pixalAdderUtility = $this->createPixelAdderUtilityObject();
        return new OpenRate($pixalAdderUtility);
    }

    private function createPixelAdderUtilityObject(){
        return new PixelAdder();
    }

    public function createMailIdGeneratorUtilityObject(){
        return new MailIdGenerator();
    }

    private function createLinkClickRateServiceObject(){
        $linkModifierUtility = new TrackingLinkModifier();
        return new LinkClickRate($linkModifierUtility);
    }

    private function createTrackingDetailsSenderServiceObject(){
	$asyncRequestUtiltiy = new AsyncRequestSender();
	return new TrackingDetailsSender($asyncRequestUtiltiy);
    }
}
