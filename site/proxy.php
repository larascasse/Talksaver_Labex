<?php

function sanitize($string = '', $is_filename = FALSE)
{
 // Replace all weird characters with dashes
 //$string = preg_replace('/[^\w\-'. ($is_filename ? '~_\.' : ''). ']+/u', '-', $string);
 $string = preg_replace(array('/\s/', '/\.[\.]+/', '/[^\w_\.\-]/'), array('_', '.', ''), $string);
 // Only allow one dash separator at a time (and make string lowercase)
 return mb_strtolower(preg_replace('/--+/u', '-', $string), 'UTF-8');
}


if(!isset($_GET['imageurl'])) {
	exit;
}
$imageurl =urldecode( $_GET['imageurl']);

$storageDir="ressources/";

if(isset($_GET['query'])) {
	
	$query = sanitize($_GET['query']);
	$storageDir = $storageDir.$query;

	$current_umask = umask();
	umask(0000);

	if (! is_dir($storageDir)) {
		mkdir($storageDir);
	}
	chmod($storageDir, 0777);
	umask($current_umask);
}

$ext = substr($imageurl, -3);
switch ($ext) {
	case 'jpg':
		$mime = 'image/jpeg';
		break;
	case 'gif':
		$mime = 'image/gif';
		break;
	case 'png':
		$mime = 'image/png';
		break;
	default:
		$mime = false;
}



$cachefile = $storageDir."/".sanitize($imageurl);
$cachetime = 604800;
// Serve from the cache if it is younger than $cachetime
if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)) {
	header("Content-type:  ".$mime);
	header('Content-length: '.filesize($cachefile));
	readfile($cachefile);
	exit;
}
ob_start(); // Start the output buffer

//$imginfo = getimagesize($imageurl);

header("Content-type: ".$mime);
readfile($imageurl);
header('Content-length: '.@filesize($imageurl));
// Cache the output to a file
$fp = fopen($cachefile, 'wb');
fwrite($fp, ob_get_contents());
fclose($fp);
ob_end_flush(); // Send the output to the browser
?>