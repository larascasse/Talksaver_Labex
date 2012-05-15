<?php

App::uses('AppController', 'Controller');


class ExtraordinariumController extends AppController {
	var $components = array('RequestHandler');
	public $scaffold;
	/**
	 * Controller name
	 *
	 * @var string
	 */
	public $name = 'Extraordinarium';

	/**
	 * This controller does not use a model
	 *
	 * @var array
	 */
	public $uses = array("Project","Media",'Tags','Event');

	function test() {

		//$data = $this->Media->contain();
		$medias = $this->Media->find('all');
		$data = array();
		
		$initdatas = array('$color'=>'#00FF00','$type'=>'circle','$dim'=> 30,'$label-size'=>20);
		$data[] = array('data'=>$initdatas,'id'=>'extraordinarium','name'=>'extraordinarium');
		
					
					
		//Inter media agencies
		$jsonInterMediaAgencies = array();
		$mediaIds=array();
		for ($index = 0; $index < count($medias); $index++) {
			$mediaIds[] = $medias[$index]['Media']['id'];
		}
		
		for ($index = 0; $index < count($medias); $index++) {
			$media = $medias[$index]['Media'];
			$jsonMediaAgencies = array();
			
			//Inter medias
			//$jsonMediaAgencies[] = array('nodeTo'=>'media'.$mediaIds[($index+1)%count($medias)],'nodeFrom'=>'media'.$mediaIds[$index],array('$color'=>'#83548B'));
			//GLOBAL
			$jsonMediaAgencies[] = array('nodeTo'=>'extraordinarium','nodeFrom'=>'media'.$mediaIds[$index],array('$color'=>'#83548B','$type'=>'arrow','$levelDistance'=>500));
			

			$projects =$medias[$index]["Project"];
			$jsonProjects=array();

			for ($index2 = 0; $index2 < count($projects); $index2++) {
				$jsonProjectData = array('$color'=>'#Ff00FF','$type'=>'triangle','$label-size'=>14);
				$jsonProjects[] = $jsonProjectData;
				$jsonProjectAgencies=array();
				$jsonProjectAgencies[] = array('nodeTo'=>'media'.$media["id"],'nodeFrom'=>'project'.$projects[$index2]["id"],'data'=>array());

				$jsonMediaAgencies[] = array('nodeFrom'=>'media'.$media["id"],'nodeTo'=>'project'.$projects[$index2]["id"],'data'=>array());


				$data[] = array('adjacencies'=>$jsonProjectAgencies,'data'=>$jsonProjectData,'id'=>'project'.$projects[$index2]["id"],'name'=>$projects[$index2]["name"]);

				//Events
				$this->Event->unbindModel(array('belongsTo' => array('User','Project')));
				$events = $this->Event->findAllByProjectId($projects[$index2]["id"]);
				//echo count($events["Event"]);
				//print_r($events);
				//echo "<hr />";
				//exit;
				$jsonEvents = array();
				for ($index3 = 0; $index3 < count($events); $index3++) {
					$event = $events[$index3]["Event"];


					$jsonEventData = array('$color'=>'#00FF00','$type'=>'star');
					$jsonEvents[] = $jsonEventData;
					$jsonEventAgencies=array();
					$jsonEventAgencies[] = array('nodeTo'=>'project'.$projects[$index2]["id"],'nodeFrom'=>'event'.$event["id"],'data'=>array());

					$data[] = array('adjacencies'=>$jsonEventAgencies,'data'=>$jsonEventData,'id'=>'event'.$event["id"],'name'=>$event["query"]);


					//$data[]=$event;
				}
			}
			$jsonMediaData = array('$color'=>'#83548B','$type'=>'circle','$dim'=> 15,'$label-size'=>11);
			$data[] = array('adjacencies'=>$jsonMediaAgencies,'data'=>$jsonMediaData,'id'=>'media'.$media["id"],'name'=>$media["name"]);
		}
		/*
		 $data = $this->Project->contain();
		 $data = $this->Project->find('all');
		 $this->set(compact('data'));
		 $this->set('_serialize', 'data');

		 $data = $this->Media->find('all');*/
		$this->set(compact('data'));
		$this->set('_serialize', 'data');
		 
		 
	}


	function test2() {

		//$data = $this->Media->contain();
		$medias = $this->Media->find('all');
		$data = array();
		for ($index = 0; $index < count($medias); $index++) {
			$media = $medias[$index]['Media'];
			$jsonData = array('$color'=>'#83548B','$type'=>'circle');
			$projects =$medias[$index]["Project"];
			$jsonProjects=array();
			for ($index2 = 0; $index2 < count($projects); $index2++) {
				$jsonProjectData = array('$color'=>'#00ff00','$type'=>'star');
				$jsonProjects[] = $jsonProjectData;

				$jsonProjectAgencies = array('nodeTo'=>'media'.$media["id"],'nodeFrom'=>'project'.$projects[$index2]["id"]);

				$data[] = array('adjacencies'=>$jsonProjectAgencies,'data'=>$jsonProjectData,'id'=>'project'.$projects[$index2]["id"],'name'=>$projects[$index2]["name"]);
			}
			$data[] = array('data'=>$jsonData,'id'=>'media'.$media["id"],'name'=>$media["name"]);
		}
		/*
		 $data = $this->Project->contain();
		 $data = $this->Project->find('all');
		 $this->set(compact('data'));
		 $this->set('_serialize', 'data');

		 $data = $this->Media->find('all');*/
		$this->set(compact('data'));
		$this->set('_serialize', 'data');
		 
		 
	}
}

/*
 * var json = [
 {
 "adjacencies": [
 {
 "nodeTo": "graphnode1",
 "nodeFrom": "graphnode0",
 "data": {}
 },
 ...
 ],
 "data": {
 "$color": "#83548B",
 "$type": "circle"
 },
 "id": "graphnode0",
 "name": "graphnode0"
 },
 {
 "adjacencies": [
 {
 "nodeTo": "graphnode2",
 "nodeFrom": "graphnode1",
 "data": {}
 }...
 ],
 "data": {
 "$color": "#83548B",
 "$type": "star"
 },
 "id": "graphnode1",
 "name": "graphnode1"
 },
 ...
 {
 "adjacencies": [],
 "data": {
 "$color": "#70A35E",
 "$type": "star"
 },
 "id": "graphnode4",
 "name": "graphnode4"
 },
 ...
 {
 "adjacencies": [],
 "data": {
 "$color": "#416D9C",
 "$type": "circle"
 },
 "id": "graphnode20",
 "name": "graphnode20"
 }
 ]; */
