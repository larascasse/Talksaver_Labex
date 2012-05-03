<?php
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

/* Let's start with some genre (Art rock). */
$genre = "Funk";
if (isset($_GET['genre'])) {
  $genre = urlencode($_GET['genre']);
}
$uri = "http://dbpedia.org/resource/$genre";

$offset = 0;
if (isset($_GET['offset'])) {
  $offset = intval($_GET['offset']);
}

/* Here we grab artists. */
$q = "
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbpedia-owl-artist: <http://dbpedia.org/ontology/Artist/>
PREFIX dbpprop: <http://dbpedia.org/property/>
SELECT DISTINCT ?artist ?artisturi ?yearsActive
WHERE
 { ?artisturi dbpedia-owl-artist:genre <$uri> ;
              rdfs:label ?artist .
   OPTIONAL { ?artisturi dbpprop:yearsActive ?yearsActive . }
   FILTER ( langMatches(lang(?artist), \"EN\") ) }
ORDER BY ?artist
OFFSET $offset
LIMIT 25
";
$artists = $dbpedia->query($q, 'rows');

print_r($q);
/* But we need to do some legwork to get the number of albums, since
 we don't have a sameAs link back to DBTune. We use sameAs.org to go
 backwards. */
$newArtists = array();
foreach ($artists as $key => $artist) {
  $sameAsURI = "http://sameas.org/rdf?uri=" . urlencode($artist['artisturi']);
  $parser = ARC2::getRDFXMLParser();
  $parser->parse($sameAsURI);
  $triples = $parser->getTriples();
  $dbturi = '';
  foreach ($triples as $triple) {
    if (substr($triple['o'], 0, 46) == 'http://dbtune.org/musicbrainz/resource/artist/') {
      $dbturi = $triple['o'];
      break;
    } elseif (substr($triple['o'], 0, 35) == 'http://www.bbc.co.uk/music/artists/') {
      /* Some hacks around the fact that DBTune may not be present on
       all artists. */
      $dbturi = 'http://dbtune.org/musicbrainz/resource/artist/' . substr($triple['o'], 35, 36);
      break;
    } elseif (substr($triple['o'], 0, 33) == 'http://zitgist.com/music/artist/') {
      /* Some hacks around the fact that DBTune may not be present on
       all artists. */
      $dbturi = 'http://dbtune.org/musicbrainz/resource/artist/' . substr($triple['o'], 33);
      break;
    }
  }
  $newArtists[$key] = $artist;
  $newArtists[$key]['artisturi'] = $dbturi;
  if ($dbturi != '') {
    /* Now that we have the DBTune URI, we can query it for the number
     of albums. */
    $q = "
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX mo: <http://purl.org/ontology/mo/>
SELECT ?album
WHERE
 { ?album a mo:Record ;
          foaf:maker <$dbturi> . }";
    $dbtArtist = $dbtune->query($q, 'rows');
    $newArtists[$key]['albums'] = count($dbtArtist);
  } else {
    $newArtists[$key]['artisturi'] = '';
    $newArtists[$key]['albums'] = '';
  }
}
$artists = $newArtists;

$i = $offset % 2;
foreach ($artists as $artist) {
?>
<tr class="row<?=$i?>">
<?php
if ($artist['artisturi']) {
?>
<td><a href="<?='artist.php?mbid=' . substr($artist['artisturi'], 46)?>"><?=$artist['artist']?></a></td>
<?php
} else {
?>
<td><?=$artist['artist']?></td>
<?php
}
?>
<td><?=$artist['yearsActive']?></td>
<td><?=$artist['albums']?></td>
</tr>
<?php
$i = ($i + 1) % 2;
}
?>