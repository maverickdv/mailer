<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'vendor/autoload.php';

$totalParams = array(
	"commonParams" => array(
		"mailerDomain" => "mailer.infoedge.com",
		"userId" => "123456",
		"mailerId" => "JASP",
		"appId" => "112",
		"email" => "varun@yopmail.com"
	),
	"trackingParams" => array(
//		"factory"=>array(),
		"openRate"=>array( ),//"mailerDomain" => "mailer.infoedge.com"),
		"linkClickRate" => array(
//			"mailerDomain" => "mailer.infoedge.com",
			"excludedLinks" => array("ngdev1.infoedge.com", "ngdev2.infoedge.com")
		)
	)
);
//$body = file_get_contents("extra/firsnaukriMailTemplate.html");
$body = "<html> <body> aklfjaklfj aklfjaklfj af laklfjalfkjfkajflkjf <a href='http://www.facebk.com'> face bbk </a> alflakfjafjafljalf            alfjaklfjfkjaf   <a href='http://www.ggle.com'>afjljafklfjaklf</a> ggole  </body> </html>";

$mailTrackerfactory = MailTracking\Factory\MailTrackerFactory::getInstance();
$mailTracker = $mailTrackerfactory->getMailTracker();
$body = $mailTracker->initiateTracking($totalParams, $body);
print_r($body);
die;




