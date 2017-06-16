<?php
namespace MailTracking\Factory; 

use MailTracking\Factory\TrackingFactory as TrackingFactory;
use MailTracking\Core\MailTracker as MailTracker;


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
	return new MailTracker($trackingFactory);	
    }

}
