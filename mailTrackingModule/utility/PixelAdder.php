<?php
namespace MailTracking\Utility;
use MailTracking\Config\TrackingConstants as TrackingConstants;

class PixelAdder{

        private function getPixelUrl($domain,$mailId){
//  /open/mailerId/<mailerId>
                return $domain."/".TrackingConstants::PIXEL_TRACKING_PATH."/$mailId";
        }

        public function addPixel($domain,$mailId,$body) {
                $pixelUrl = $this->getPixelUrl($domain,$mailId);
                $doc = new \DOMDocument();
                $doc->loadHTML($body);
		/// creating image
                $div = $doc->createElement("img");
                $div->setAttribute("src",$pixelUrl);
                $div->setAttribute("height", 1);
                $div->setAttribute("width", 1);
                $div->setAttribute("visibility", "hidden");
		
		$body = $doc->getElementsByTagName('body');
		if ( $body && 0 < $body->length ) {
			$body = $body->item(0);
			$body->appendChild($div);
		}
		else{
//			throw new BodyNotFoundInMail(); 
		}
                return $doc->saveHTML();
        }

}
