<?php

namespace MailTracking\Factory; 

use MailTracking\Factory\TrackingFactory as TrackingFactory;
use MailTracking\Core\MailTracker as MailTracker;
use MailTracking\Config\TrackingConstants as TrackingConstants;

class MailTrackerFactory {
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

    public function getMailTracker(){
	$trackingFactory = TrackingFactory::getInstance();
        $trackingConfig = \ncYaml::load(TrackingConstants::BASE_CONFIG_PATH_MAILER."/".TrackingConstants::TRACKING_CONFIG_FILE_NAME);
	return new MailTracker($trackingFactory , $trackingConfig);	
    }

}
