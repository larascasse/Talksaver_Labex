<?php
require("OAuth.php");
 
$cc_key  = "dj0yJmk9MHA2UHpwSmF3Yzg3JmQ9WVdrOVpUWnlWbEl5TXpBbWNHbzlNelV4TnpZME16WXkmcz1jb25zdW1lcnNlY3JldCZ4PTBk";
$cc_secret = "2e6dbfddf513ca6d07f7c4bacec52eabfb772058";
$url = "http://yboss.yahooapis.com/ysearch/";
if(isset($_GET["type"])) {
	$url.=$_GET["type"];
}
else {
	$url.= "web,images";
}
//echo $url;
$args = array();
$args["q"] = $_GET["q"];
$args["format"] = "json";
$args["count"] = "5";
//$args["type"] = isset($_GET["type"])?$_GET["type"]:"web,images";

$consumer = new OAuthConsumer($cc_key, $cc_secret);
$request = OAuthRequest::from_consumer_and_token($consumer, NULL,"GET", $url, $args);
$request->sign_request(new OAuthSignatureMethod_HMAC_SHA1(), $consumer, NULL);
$url = sprintf("%s?%s", $url, OAuthUtil::build_http_query($args));
$ch = curl_init();
$headers = array($request->to_header());
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$rsp = curl_exec($ch);

header('content-type: application/json; charset=utf-8');
echo $_GET['callback'] . '('.$rsp.')';
//$results = json_decode($rsp);
//print_r($results);
?>