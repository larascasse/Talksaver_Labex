<?php

/*
 * 
SELECT ?abstract
WHERE {
{ <http://dbpedia.org/resource/Civil_engineering> <http://dbpedia.org/ontology/abstract> ?abstract .
FILTER langMatches( lang(?abstract), ‘en’) }
}


SELECT * WHERE {
  ?episode <http://purl.org/dc/terms/subject>
   <http://dbpedia.org/resource/Category:The_Simpsons_%28season_14%29_episodes> .
  ?episode dbpedia2:blackboard ?chalkboard_gag .
}


 */
function formatDate($date, $emptyIsPresent=false) {
  if ($emptyIsPresent && $date == '') {
    return 'present';
  }
  
  $dateArray = explode('-', $date);
  $obj = new DateTime($date);
  if ($dateArray[1] == '00') {
    $obj->modify('+1 year');
    return $obj->format('Y');
  } elseif ($dateArray[2] == '00') {
    $obj->modify('+1 month');
    return $obj->format('F Y');
  } else {
    return $obj->format('F j, Y');
  }
}

/* Include ARC2 classes. */
include_once("../libs_php/arc2/ARC2.php");

/* Configure the app to use DBPedia. */
$dbpconfig = array(
  "remote_store_endpoint" => "http://dbpedia.org/sparql",
);

/* Create the 'remote store' */
$dbpedia = ARC2::getRemoteStore($dbpconfig);

/* Configure the app to use DBTune. */
$dbtconfig = array(
  "remote_store_endpoint" => "http://dbtune.org/musicbrainz/sparql",
);

/* Create the 'remote store' */
$dbtune = ARC2::getRemoteStore($dbtconfig);

$q = "
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?name ?popularity ?abstract ?wikipedia ?img
WHERE
 { <http://dbpedia.org/resource/Rock_music> rdfs:label ?name ;
          rdfs:comment ?abstract ;
          foaf:page ?wikipedia .
   OPTIONAL { <http://dbpedia.org/resource/Rock_music> dbpprop:popularity ?popularity . }
   OPTIONAL { <http://dbpedia.org/resource/Rock_music> foaf:depiction ?img . }
   FILTER ( langMatches(lang(?name), \"EN\") &&
            langMatches(lang(?abstract), \"EN\") ) }
";
$genre = $dbpedia->query($q, 'row');
echo "<pre>";print_r($genre);echo "</pre>";
/*
Array
(
    [name type] => literal
    [name] => Rock music
    [name lang] => en
    [popularity type] => literal
    [popularity] => 1950.0
    [popularity datatype] => http://dbpedia.org/datatype/second
    [abstract type] => literal
    [abstract] => Rock music is a genre of popular music that developed during and after the 1960s, particularly in the United Kingdom and the United States. It has its roots in 1940s and 1950s rock and roll, itself heavily influenced by rhythm and blues and country music. Rock music also drew strongly on a number of other genres such as blues and folk, and incorporated influences from jazz, classical and other musical sources.
    [abstract lang] => en
    [wikipedia type] => uri
    [wikipedia] => http://en.wikipedia.org/wiki/Rock_music
    [img type] => uri
    [img] => http://upload.wikimedia.org/wikipedia/commons/1/16/Rhcp-live-pinkpop05.jpg
)
 */



$q = "
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT (?predicate) WHERE {
                ?s ?predicate <http://dbpedia.org/resource/Eric_Clapton>.
            } } ORDER BY ?predicate 
";
$genre = $dbpedia->query($q, 'rows');
echo "<pre>";print_r($genre);echo "</pre>";


echo '<h2>Software developed by an organisation founded in California:</h2>';
$q="
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT *
  WHERE
    { 
      ?company  a                                              <http://dbpedia.org/ontology/Organisation>  .
      ?company  <http://dbpedia.org/ontology/foundationPlace>  <http://dbpedia.org/resource/Paris>    .
      ?product  <http://dbpedia.org/ontology/developer>        ?company                                    .
      ?product  a                                              <http://dbpedia.org/ontology/Software>
    }
";
//$test= $dbpedia->query($q, 'row');
$test= $dbpedia->query($q, 'rows');
echo htmlspecialchars($q);
echo "<pre>";print_r($test);echo "</pre>";




echo '<h2>the short list of musical artists who have three distinctions: Grammy Award winners, Rock and Roll Hall of Fame inductees, and MTV Video Music Awards winners</h2>';
$q='
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?allAwards
        WHERE { 
         ?allAwards <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Grammy_Award_winners>.
         ?allAwards <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Rock_and_Roll_Hall_of_Fame_inductees>.
         ?allAwards <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:MTV_Video_Music_Awards_winners>
        } ORDER BY ?allAwards                       
          
';
$test= $dbpedia->query($q, 'rows');
echo htmlspecialchars($q);
echo "<pre>";print_r($test);echo "</pre>";




echo '<h2>Figure 18: Find Predicates for Which Clapton is (all or part of) the Object</h2>';
$q='
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?predicate  WHERE  {
            ?s ?predicate ?o.
            FILTER regex(?o, "Eric Clapton").
        } ORDER BY ?predicate                       
          
';
//$test= $dbpedia->query($q, 'row');
$test= $dbpedia->query($q, 'rows');
echo htmlspecialchars($q);
echo "<pre>";print_r($test);echo "</pre>";
exit();

$q="
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?abstract
WHERE {
{ <http://dbpedia.org/resource/Civil_engineering> <http://dbpedia.org/ontology/abstract> ?abstract .
FILTER langMatches( lang(?abstract), ‘en’) }
}";
$test=$genre = $dbpedia->query($q, 'row');
print_r($test);

$q="
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT * WHERE {
  ?episode <http://purl.org/dc/terms/subject>
   <http://dbpedia.org/resource/Category:The_Simpsons_%28season_14%29_episodes> .
  ?episode dbpedia:blackboard ?chalkboard_gag .
}
";
$test= $dbpedia->query($q, 'row');
echo htmlspecialchars($q);
print_r($test);

$q="
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT *
  WHERE
    { 
      ?company  a                                              <http://dbpedia.org/ontology/Organisation>  .
      ?company  <http://dbpedia.org/ontology/foundationPlace>  <http://dbpedia.org/resource/California>    .
      ?product  <http://dbpedia.org/ontology/developer>        ?company                                    .
      ?product  a                                              <http://dbpedia.org/ontology/Software>
    }
";
$test= $dbpedia->query($q, 'row');
echo htmlspecialchars($q);
print_r($test);






$q="
PREFIX p: <http://dbpedia.org/property/>
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX category: <http://dbpedia.org/resource/Category:>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX geo: <http://www.georss.org/georss/>
SELECT DISTINCT ?painting ?image ?title ?artist ?artistName ?page
WHERE {
 ?painting <http://dbpedia.org/property/wikiPageUsesTemplate> <http://dbpedia.org/resource/Template:infobox_painting>;
 <http://dbpedia.org/ontology/thumbnail> ?image;
 rdfs:label ?title;
 foaf:page ?page;
 p:artist ?artist;
skos:subject ?subject.?subject rdfs:label ?label.
                      FILTER regex(?label, 'painting','i')
 OPTIONAL {
    ?painting <http://dbpedia.org/property/artist> ?artist1.
     ?artist1 rdfs:label ?artistName.
     FILTER (lang(?artistName)='en')
   
 }
 FILTER (lang(?title)='en')
}LIMIT 10";
$test= $dbpedia->query($q, 'row');
echo htmlspecialchars($q);
print_r($test);

exit;

/* Let's start with some genre (Art rock). */
$genre = "Art_rock";
if (isset($_GET['genre'])) {
  $genre = urlencode($_GET['genre']);
}
$genreLink = $genre;
$uri = "http://dbpedia.org/resource/$genre";
echo "<pre>".print_r($uri)."</pre><br />";
/* Let's query DBPedia for some genre info. */
$q = "
PREFIX space: <http://purl.org/net/shemas/space/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbpprop: <http://dbpedia.org/property/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?name ?popularity ?abstract ?wikipedia ?img
WHERE
 { <$uri> rdfs:label ?name ;
          rdfs:comment ?abstract ;
          foaf:page ?wikipedia .
   OPTIONAL { <$uri> dbpprop:popularity ?popularity . }
   OPTIONAL { <$uri> foaf:depiction ?img . }
   FILTER ( langMatches(lang(?name), \"EN\") &&
            langMatches(lang(?abstract), \"EN\") ) }
";
$genre = $dbpedia->query($q, 'row');

/* Let's also grab related genres. */
$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { <$uri> dbpedia-owl-musicgenre:musicSubgenre ?genreuri .
   ?genreuri rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$subgenres = $dbpedia->query($q, 'rows');

echo "<pre>".htmlspecialchars($q)."</pre><br />";

$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { <$uri> dbpedia-owl-musicgenre:stylisticOrigin ?genreuri .
   ?genreuri rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$stylisticOrigins = $dbpedia->query($q, 'rows');

$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { ?genreuri dbpedia-owl-musicgenre:musicSubgenre <$uri> ;
             rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$parentGenres = $dbpedia->query($q, 'rows');

$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { ?genreuri dbpedia-owl-musicgenre:stylisticOrigin <$uri> ;
             rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$stylisticChildren = $dbpedia->query($q, 'rows');

$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { <$uri> dbpedia-owl-musicgenre:derivative ?genreuri .
   ?genreuri rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$derivatives = $dbpedia->query($q, 'rows');

$q = "
PREFIX dbpedia-owl-musicgenre: <http://dbpedia.org/ontology/MusicGenre/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?genre ?genreuri
WHERE
 { ?genreuri dbpedia-owl-musicgenre:derivative <$uri> ;
             rdfs:label ?genre . 
   FILTER ( langMatches(lang(?genre), \"EN\") ) }
";
$derivativeOf = $dbpedia->query($q, 'rows');

if(!isset($genre['name'])) {
	$genre['name'] = $_GET["genre"];
}
/* See if there's a tag in MusicBrainz... */
$q = "
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX tags: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>
SELECT DISTINCT ?taguri
WHERE
 { ?taguri a tags:Tag ;
           rdfs:label ?tag .
   FILTER ( str(?tag) = '" . mb_strtolower($genre['name'], 'UTF-8') . "' ) }
";
$tags = $dbtune->query($q, 'rows');
if (count($tags) > 0) {
  $musicbrainzURI = 'http://musicbrainz.org/show/tag/?tag=' . urlencode(mb_strtolower($genre['name'], 'UTF-8')) . '&show=all';
} else {
  $musicbrainzURI = false;
}

?>
<html>
<head>
<title>Genre: <?=$genre['name']?></title>
<link rel="stylesheet" href="music.css"/>
<script type="text/javascript">var genre = "<?=$genreLink?>";</script>
<script type="text/javascript" src="scriptaculous/lib/prototype.js"></script>
<script type="text/javascript" src="genre.js"></script>
</head>
<body id="body">
<h1 id="genreName"><?=$genre['name']?></h1>
<?php
if (isset($genre['img'])) {
?>
<div id="image">
<img src="<?=$genre['img']?>"/>
<p id="imageCaption"><?=$genre['name']?></p>
</div>
<?php
}
if (isset($genre['popularity'])) {
?>
<p id="popularity" class="dataline"><strong>Popularity:</strong> <?=$genre['popularity']?></p>
<?php
}
if (count($parentGenres) > 0) {
?>
<p id="supergenres" class="dataline"><strong>Supergenres:</strong> <?php $i = 0; foreach ($parentGenres as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
if (count($stylisticOrigins) > 0) {
?>
<p id="origins" class="dataline"><strong>Stylistic Origins:</strong> <?php $i = 0; foreach ($stylisticOrigins as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
if (count($derivativeOf) > 0) {
?>
<p id="derivativeOf" class="dataline"><strong>Derivative Of:</strong> <?php $i = 0; foreach ($derivativeOf as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
if (count($subgenres) > 0) {
?>
<p id="subgenres" class="dataline"><strong>Subgenres:</strong> <?php $i = 0; foreach ($subgenres as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
if (count($derivatives) > 0) {
?>
<p id="derivatives" class="dataline"><strong>Derivatives:</strong> <?php $i = 0; foreach ($derivatives as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
if (count($stylisticChildren) > 0) {
?>
<p id="stylisticChildren" class="dataline"><strong>Stylistic Children:</strong> <?php $i = 0; foreach ($stylisticChildren as $genreLink) { print (($i++ != 0) ? ", " : "") . "<a href=\"genre.php?genre=" . substr($genreLink['genreuri'], 28) . "\">" . $genreLink['genre'] . "</a>"; } ?></p>
<?php
}
?>
<p id="abstract"><?= isset($genre['abstract'])?$genre['abstract']:"";?></p>
<?php
if (isset($genre['wikipedia']) || $musicbrainzURI) {
?>
<p id="links">
<?php
if ($musicbrainzURI) {
?>
<a href="<?=$musicbrainzURI?>">Musicbrainz</a>
<?php
}
if (isset($genre['wikipedia'])) {
?>
<a href="<?=$genre['wikipedia']?>">Wikipedia</a>
<?php
}
?>
</p>
<?php
}
?>
<table id="artists">
<thead>
<tr>
<th>Artist</th>
<th>Years Active</th>
<th>Number of Records</th>
</tr>
</thead>
<tbody>
<tr id="loadingArtists" class="loading">
<td colspan="3">
<img src="loading.gif"/>
<br/>
Loading Artists...
</td>
</tbody>
</table>
</body>
</html>