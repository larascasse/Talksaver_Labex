<?php
// Rapporte les erreurs d'exŽcution de script
error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('error_reporting', E_ERROR );

$url = "http://yboss.yahooapis.com/ysearch/";

if($_GET["type"]) {
	$url.=$_GET["type"];
}
else {
	$url.= "news,web,images";
}



$_GET['callback']=$_GET['callback']?$_GET['callback']:"l";
$args = array();
$args["q"] = $_GET["q"];
$args["format"] = "json";
/*
 $ch = curl_init();
 $headers = array($request->to_header());
 curl_setopt($ch, CURLOPT_URL, $url);
 curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
 $rsp = curl_exec($ch);*/

$post=array();
$post[""]==

$post["langue"]="fr_fr";
$post["param.full"]=$_GET["q"]?$_GET["q"]:"picasso";
$post["param.ressourceSuivante"]="0";
$post["autoCompletion"]="http://pompidou-vm-solr1:8080/solr-cpv/,http://pompidou-vm-solr2:8080/solr-cpv/,http://pompidou-vm-solr3:8080/solr-cpv/,http://pompidou-vm-solr4:8080/solr-cpv/";
$post["checkBoxOeuvre"]="on";
$post["__checkbox_param.evenement"]="true";
$post["__checkbox_param.dossierPedagogique"]="true";
$post["param.oeuvreTitre"]="";
$post["param.oeuvreAuteur"]="";
$post["param.choixDate"]="date exacte";
$post["param.oeuvreDateDebut"]="";
$post["param.oeuvreDateFin"]="";
$post["__checkbox_param.oeuvrePresenteMusee"]="true";
$post["param.oeuvreNumeroInventaire"]="";
$post["param.oeuvreMouvement"]="";
$post["param.oeuvreType"]="";
$post["param.oeuvreMateriau"]="";
$post["param.personneNom"]="";
$post["__checkbox_param.personneLieuNaissance"]="true";
$post["__checkbox_param.personneLieuActivite"]="true";
$post["__checkbox_param.personneLieuDeces"]="true";
$post["param.personneLieu"]="";
$post["param.personneRole"]="";


require_once("Curl.php");
$curl = new Curl("http://beta.centrepompidou.fr/cpv/rechercher.action");
$curl->setName("cpompidou");
$curl->setPass("CielIkom5");
$curl->useAuth(true);
$curl->setPost($post);
$curl->createCurl();

$domDocument = new DOMDocument();
//domDocument->loadHTML("<html><body><a href='llll' class='l'>sdsdsds</a>,<a href='llll' class='l'>sdsdsds</a></body></html>");
//echo $curl->__toString();
$domDocument->loadHTML($curl->__toString());
$response=array();
$documentLinks = $domDocument->getElementsByTagName("li");


/*
 * <li class="type_reproduction">
 * <a href="/cpv/ressource.action?param.id=FR_R-585715defb5de2f23591ab5737b7b9&amp;param.idSource=FR_O-1faaeedd32e02289bb7aea21921e&amp;param.lienPlanMaquette=Reproduction+d%27une+%26oelig%3Buvre">
 * <p class="reference">
 <span class="artiste">Pablo Picasso</span><cite class="titre">, Vase &agrave; la t&ecirc;te</cite><span class="date">, 1956</span>
 </p>
 <p class="result_type">
 reproduction d'une &oelig;uvre
 </p><img alt="Image" src='/media/imgcoll/Collection/4F/45/4F45200_small.jpg'
 onerror="javascript:this.src='/cpv/images/ico_image_fr.gif'; this.style.width='44px';" />
 </a>
 </li>
 */

/*
 *
 * clickurl	String	http://www.inminds.co.uk/picasso-weeping-woman-1937.jpg
 size	String	61.2KB
 format	String	jpeg
 height	String	734
 refererclickurl	String	http://www.inminds.co.uk/weeping-woman-picasso-1937.html
 refererurl	String	http://www.inminds.co.uk/weeping-woman-picasso-1937.html
 title	String	Weeping Woman - Picasso
 url	String	http://www.inminds.co.uk/picasso-weeping-woman-1937.jpg
 width	String	601
 thumbnailheight	String	160
 thumbnailurl	String	http://ts4.mm.bing.net/images/thumbnail.aspx?q=4682077530031643&id=611a9a61b9b4bc2e1d73f25f120abb14
 thumbnailwidth	String	131
 */
for($i=0;$i<$documentLinks->length;$i++)
{
	$documentLink = $documentLinks->item($i);

	if($documentLink->getAttribute("class") == "type_reproduction")
	{
		$item = array();
		$images = $documentLink ->getElementsByTagName("img");
		for($j=0;$j<$images->length;$j++) {
			$image = $images->item($j);
			$item["thumbnailurl"]="http://cpompidou:CielIkom5@beta.centrepompidou.fr".$image->getAttribute("src");
			$item["thumbnailheight"]=$image->getAttribute("height")?$image->getAttribute("height"):100;
			$item["thumbnailwidth"]=$image->getAttribute("height")?$image->getAttribute("height"):100;
				
		}
		$links = $documentLink->getElementsByTagName("a");
		if($links->length>0) {
			$link=$links->item(0);
			$item["url"] = "http://cpompidou:CielIkom5@beta.centrepompidou.fr".$link->getAttribute("href");
		}


		$spans = $documentLink ->getElementsByTagName("span");
		for($j=0;$j<$spans->length;$j++) {

			$span = $spans->item($j);
			if($span->getAttribute("class") == "artiste")
			$item["titre"]=preg_replace('/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/','',trim($span->textContent));
			$item["titre"]=str_replace('\\t','AAA',$item["titre"]);
			$item["titre"]=preg_replace('/\s+/','#####',$item["titre"]);
			$item["titre"]=str_replace('#####'," ",$item["titre"]);
		}
		
		 $item["size"] = "61.2KB";
 		 $item["format"]="jpeg";
 		 $item["height"]="734";
 		 $item["refererclickurl"]="http://www.inminds.co.uk/weeping-woman-picasso-1937.htm";
         $item["refererurl"]="http://www.inminds.co.uk/weeping-woman-picasso-1937.html";

		$response[]=$item;
		//echo $documentLink->getAttribute("href")."<br>";
		//$response[]=$documentLink->getAttribute("src");
	}
}

$responseimage = array("start"=>0,"count"=>count($response),"totalresults"=>count($response),"results"=>$response);
$final=array("bossresponse"=>array("responsecode"=>200,"images"=>$responseimage));
//header('content-type: application/json; charset=utf-8');
$rsp = json_encode($final);
echo $_GET['callback'] . '('.$rsp.')';
//$results = json_decode($rsp);
//print_r($results);
?>