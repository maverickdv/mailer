<?php
namespace MailTracking\Utility;

class MailIdGenerator{

    public static function generateUniqueId($appId,$userId,$mailerId){
// key value pair
        $id = $appId."|XxX|".$userId."|XxX|".$mailerId."|XxX|".time();
        $encodedId = base64_encode($id);
        $encodedId = urlencode($encodedId);
        return $encodedId;
    }	
} 
