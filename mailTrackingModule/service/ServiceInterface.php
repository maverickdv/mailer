<?php

namespace MailTracking\Service;

interface ServiceInterface 
{
    public function execute($commonParams , $params , $body , $mailId);
}


