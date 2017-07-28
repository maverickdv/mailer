<?php
$fp = fopen('akamai_access_log.20170719', 'r');

$pos = 3083 ;// Skip final new line character (Set to -1 if not present)

$lines = array();
$currentLine = '';
$numberLines = 0;
while (-1 !== fseek($fp, $pos, SEEK_SET)) {
	$char = fgetc($fp);
	if (PHP_EOL == $char) {
		if($currentLine!="") {
			$numberLines ++;
			$lines[] = $currentLine;
			$currentLine = '';
		}
	} else {
		$currentLine = $currentLine.$char;
	}
	if($numberLines==10) {
		break;
	}
	$pos++;
}
echo $pos;

print_R($lines);

