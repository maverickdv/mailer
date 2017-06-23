<?php

namespace MailTracking\Utility;

class MailIdGenerator{

    public static function generateUniqueId($appId,$userId,$mailerId,$email){
// key value pair
	$id = $appId."|XxX|".$userId."|XxX|".$mailerId."|XxX|".time()."|XxX|".$email;
	$encodedId = Base32::encode($id);
        return $encodedId;
    }	
} 
