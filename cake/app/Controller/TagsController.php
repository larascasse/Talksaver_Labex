<?php
App::uses('AppController', 'Controller');
/**
 * Tags Controller
 *
 */
class TagsController extends AppController {

	/**
	 * Scaffold
	 *
	 * @var mixed
	 */
	public $scaffold;
	var $components = array('RequestHandler');

	public function project($id_project="") {

		/*
		 * $this->Event->bindModel(array(    'hasAndBelongsToMany' => array(
		 *         'Tag' => array('conditions'=>array('Tag.name'=>'Dessert')))));
		 *         $this->Event->find('all');
		 */
		//$this->Tag->recursive = 0;
		//$this->Tag->unbindModel(array('belongsTo' => array('User','Project')));

		/*$this->Tag->bindModel(
				array(    'hasAndBelongsToMany' => array(
		          'Event' => array(
					'className' => 'Event',
		          	'conditions'=>''
					)
				)
				)
				);*/

			
		$data = $this->Tag->find('all');
		$this->data = $data;
		//return new JsonResponse($data);
		$this->set(compact('data'));
		$this->set('_serialize', 'data');

	}

	public function popcorn($id=null) {
		if ( $this->RequestHandler->isAjax() ) {
			$this->request->data = array("Tag"=>$this->request->data);
			//return new JsonResponse($this->request->data);
		}


		$this->Tag->id = $id;
		if ($this->request->is('post') || $this->request->is('put')) {

			$this->Tag->id = $id;
			if (!$this->Tag->exists()) {
				$this->Tag->create();
				if ($this->Tag->save($this->request->data)) {
				} else {
					return new JsonResponse("error create");
				}
			}
			else {
				if ($this->Tag->save($this->request->data)) {

				} else {
					return new JsonResponse("error save");
				}
			}
		}

		$this->Tag->recursive = 0;
		$this->Tag->unbindModel(array('belongsTo' => array('User','Project')));
		$data = $this->Tag->findById($this->Tag->id);
		$this->data = $data;
		//return new JsonResponse($data);
		$this->set(compact('data'));
		$this->set('_serialize', 'data');

	}
}
