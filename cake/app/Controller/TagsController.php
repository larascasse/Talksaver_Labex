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


		if($id_project!="") {
			$this->Tag->unbindModel(array('hasAndBelongsToMany' => array('Project')));

			/*$this->Tag->bindModel(array(
			 'hasOne' => array(
			 'ProjectsTag',
			 'FiltreTag' => array(
			 'className' => 'Project',
			 'foreignKey' => false,
			 'conditions' => array('FiltreTag.id = ProjectsTag.id')
			 ))));
			 	
			 $data = $this->Tag->find('all', array(
			 'fields' => array('Tag.*'),
			 'conditions'=>array('FiltreTag.nom'=>'Dessert')
			 ));*/


			/*$this->Tag->bindModel(
			 array(    'hasAndBelongsToMany' => array(
				'Project' => array(

				'conditions' => array('ProjectsTag.project_id' => $id_project),
				'dependent' => true
				)
				)
				)
				);
				$data = $this->Tag->find('all',array(
				'conditions2'=>array('projects.project_id>'=>0)
				));*/
			$options['joins'] = array(
			array('table' => 'projects_tags',
				'alias' => 'ProjectsTag',
				'type' => 'inner',
				'conditions' => array(
				'Tag.id = ProjectsTag.tag_id'
			)
			),
			array('table' => 'projects',
				'alias' => 'Project',
				'type' => 'inner',
				'conditions' => array(
				'ProjectsTag.project_id = Project.id'
			)
			)
			);

			$options['conditions'] = array(
				' Project.id' => $id_project
			);

			$data = $this->Tag->find('all', $options);
				
		}
		else
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
