<?php

namespace MailTracking\Utility;

use MailTracking\Config\TrackingConstants as TrackingConstants;

class TrackingLinkModifier
{
//	private $excludeLinks;
//	private $proxyLink;

//problem with mailId discuss it
	public function __construct() {
// proxy link should be complete mailer.infoedge.com/click/mailId/{$mailId}/url/{$url}
//		$this->proxyLink = $proxyLink;
//		$this->generateUniversalExcludeLinks($excludeLinks);
	}

	public function replaceLinks($proxyLink, $excludeLinks , $htmlDocument , $mailId) {
		$proxyUrl = $proxyLink."/".TrackingConstants::LINK_CLICK_RATE_TRACKING_PATH_MAILID."/".$mailId."/".TrackingConstants::LINK_CLICK_RATE_TRACKING_PATH_URLID;
		$excludeLinks = $this->generateUniversalExcludeLinks($excludeLinks);
		$doc = new \DOMDocument();
                $doc->loadHTML($htmlDocument);
                $xpath = new \DOMXpath($doc);
                $anchors = $xpath->query("//a[@href]");
                foreach( $anchors as $anchor) {
                        $href = $anchor->getAttribute("href");
                        $processedHref = $this->getLinkWithoutParams($href);
                        if(in_array($processedHref , $excludeLinks)) {
                                continue;
                        }
                        $anchor->setAttribute("href", $proxyUrl . urlencode($href));
                }
                return $xpath->document->saveHTML();
	}
	private function generateUniversalExcludeLinks($excludeLinks) {
		$tmpExcludeLinks = array();
		foreach($excludeLinks as $links) {
			$tmpExcludeLinks[] = $this->processHref($links);
		}
		return $tmpExcludeLinks;
	}
	private function getLinkWithoutParams($link) {
		$processedLink = $this->processHref($link);
		return explode("?" , $processedLink)[0];
	}
	private function processHref($link) {
		return $this->remove_www($this->remove_http($link));
	}
	private function remove_http($url) {
		$disallowed = array('http://', 'https://');
		foreach($disallowed as $d) {
			if(strpos($url, $d) === 0) {
				return str_replace($d, '', $url);
			}
		}
		return $url;
	}
	private function remove_www($link) {
		return preg_replace('/^www\./', '', $link);
	}
}

