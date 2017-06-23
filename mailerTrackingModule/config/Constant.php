<?php
namespace MailTracking\Config;

class TrackingConstants{

	const PIXEL_TRACKING_PATH = "mailers/open/mailId";
	const LINK_CLICK_RATE_TRACKING_PATH_MAILID = "mailers/click/mailId";
	const LINK_CLICK_RATE_TRACKING_PATH_URLID = "url/";
	const MAIL_DETAILS_TRACKING_URL  = "mailers/addMail";
	const CURL_TIMEOUT_IN_MS = 1 ;
	const NAUKRI_DOMAIN_ID = 1;
	const NAUKRIGULF_DOMAIN_ID = 2;
	const FIRSTNAUKRI_DOMAIN_ID = 3;
        const BASE_CONFIG_PATH_MAILER = __DIR__ ;
        const TRACKING_CONFIG_FILE_NAME = "trackingConfig.yml";
	public static $ALLOWED_ENVIRONMENTS = array("dev", "test", "live");
	public static $MANDATORY_PARAMS_FOR_MAILID = array("appId", "userId", "mailerId", "email");
	const SERVICE_EXCEPTION_MSG = "Service Not Found Excpetion";
	const APPID_EXCEPTION_MSG = "only 1**, 2**, 3** appIds are allowed exception";
	const ENVIRONMENT_EXCEPTION_MSG = "only dev, test, live environment allowed exception";
	const INSUFFICIENT_MANDATORY_PARAMS_EXCEPTION_MSG = "appId , userId , mailerId , email must be present for logging exception";
	const BODY_EMPTY_EXCEPTION_MSG = "Mail Body is Empty Excpetion";
	const ASYNC_REQUEST_FAILED_EXCEPTION_MSG = "Async Request Failed Excpetion";
	const NAUKRI_APPID_REGEX = "/^1\d{2}$/";
	const NAUKRIGULF_APPID_REGEX = "/^2\d{2}$/";
	const FIRSTNAUKRI_APPID_REGEX = "/^3\d{2}$/";
    
}
