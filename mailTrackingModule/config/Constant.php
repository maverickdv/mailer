<?php
namespace MailTracking\Config;

class TrackingConstants{

	const PIXEL_TRACKING_PATH = "open/mailId";
	const LINK_CLICK_RATE_TRACKING_PATH_MAILID = "click/mailId";
	const LINK_CLICK_RATE_TRACKING_PATH_URLID = "url/";
	const MAIL_DETAILS_TRACKING_URL  = "http://127.0.0.1:5000/addMail";
	const TRACKING_URL = "http://127.0.0.1";
	const CURL_TIMEOUT_IN_MS = 1 ;
	public static $CONFIG_PATH = __DIR__."/trackingConfig.yml";  
    
}
