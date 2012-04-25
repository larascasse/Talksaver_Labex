<?php
App::uses('AppController', 'Controller');
//App::uses('JsonResponse', 'Json.Network');
/**
 * Projects Controller
 *
 */
class ProjectsController extends AppController {
	var $components = array('RequestHandler');
	/**
	 * Scaffold
	 *
	 * @var mixed
	 */
	public $scaffold;

	public function popcorn($id=null) {
		Configure::write('debug',0);
		if ( $this->RequestHandler->isAjax() ) {
			$this->request->data = array("Project"=>$this->request->data);
			//return new JsonResponse($this->request->data);
		}


		$this->Project->id = $id;
		if ($this->request->is('post') || $this->request->is('put')) {
				
			$this->Project->id = $id;
			if (!$this->Project->exists()) {
				$this->Project->create();
				if ($this->Project->save($this->request->data)) {
				} else {
					return new JsonResponse("error create");
				}
			}
			else {
				if ($this->Project->save($this->request->data)) {
						
				} else {
					return new JsonResponse("error save");
				}
			}
		}

		$this->Project->recursive = 0;
		
		$this->Project->unbindModel(array('belongsTo' => array('User')));
		
		$data = $this->Project->findById($this->Project->id);
		$this->data = $data;
		//return new JsonResponse($data);
		$this->set(compact('data'));
	    $this->set('_serialize', 'data');

	}

	public function json_list() {
		$data = $this->Project->find('all');
		return new JsonResponse($data);
	}

	function save($id) {
		/*
		 *
		 * $this->Project->read(null, 1);
		 $this->Project->set('title', 'New title for the article');
		 $this->Project->save();

		 */
		if(!empty($this->data)) {
			//If the form data can be validated and saved...
			if($this->Project->save($this->data)) {
				//Set a session flash message and redirect.
				//$this->Session->setFlash("Project Saved!");
				return new JsonResponse("ok");
			}
		}

		//If no form data, find the recipe to be edited
		//and hand it to the view.
		$this->data = $this->Project->findById($id);
	}


}
