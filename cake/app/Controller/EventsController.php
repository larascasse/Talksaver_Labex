<?php
App::uses('AppController', 'Controller');
//App::uses('JsonResponse', 'Json.Network');
/**
 * Events Controller
 *
 * @property Event $Event
 */
class EventsController extends AppController {
	var $components = array('RequestHandler');

/**
 * index method
 *
 * @return void
 */
	public function index() {
		$this->Event->recursive = 0;
		$this->set('events', $this->paginate());
		
	}
	
	public function project($id_project) {
		$this->Event->recursive = 0;
		$this->Event->unbindModel(array('belongsTo' => array('User','Project')));
		 $data = $this->Event->findAllByProjectId($id_project);
        	$this->data = $data;
			//return new JsonResponse($data);
			$this->set(compact('data'));
		    $this->set('_serialize', 'data');
		
	}
	
	
	public function popcorn($id=null) {
		if ( $this->RequestHandler->isAjax() ) {
			$this->request->data = array("Event"=>$this->request->data);
   			//return new JsonResponse($this->request->data);
		}
		

		$this->Event->id = $id;
		if ($this->request->is('post') || $this->request->is('put')) {
			
			$this->Event->id = $id;
			if (!$this->Event->exists()) {
				$this->Event->create();
					if ($this->Event->save($this->request->data)) {
				} else {
					return new JsonResponse("error create");
				}
			}
			else {
				if ($this->Event->save($this->request->data)) {
					
				} else {
					return new JsonResponse("error save");
				}
			} 			
		}
		
		$this->Event->recursive = 0;
		$this->Event->unbindModel(array('belongsTo' => array('User','Project')));
		$data = $this->Event->findById($this->Event->id);
        	$this->data = $data;
			//return new JsonResponse($data);
			$this->set(compact('data'));
		    $this->set('_serialize', 'data');
		
	}

/**
 * view method
 *
 * @param string $id
 * @return void
 */
	public function view($id = null) {
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		$this->set('event', $this->Event->read(null, $id));
	}

/**
 * add method
 *
 * @return void
 */
	public function add() {
		if ($this->request->is('post')) {
			$this->Event->create();
			if ($this->Event->save($this->request->data)) {
				$this->flash(__('Event saved.'), array('action' => 'index'));
			} else {
			}
		}
		$projects = $this->Event->Project->find('list');
		$users = $this->Event->User->find('list');
		$this->set(compact('projects', 'users'));
	}

/**
 * edit method
 *
 * @param string $id
 * @return void
 */
	public function edit($id = null) {
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Event->save($this->request->data)) {
				$this->flash(__('The event has been saved.'), array('action' => 'index'));
			} else {
			}
		} else {
			$this->request->data = $this->Event->read(null, $id);
		}
		$projects = $this->Event->Project->find('list');
		$users = $this->Event->User->find('list');
		$this->set(compact('projects', 'users'));
	}

/**
 * delete method
 *
 * @param string $id
 * @return void
 */
	public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		if ($this->Event->delete()) {
			$this->flash(__('Event deleted'), array('action' => 'index'));
		}
		$this->flash(__('Event was not deleted'), array('action' => 'index'));
		$this->redirect(array('action' => 'index'));
	}
/**
 * admin_index method
 *
 * @return void
 */
	public function admin_index() {
		$this->Event->recursive = 0;
		$this->set('events', $this->paginate());
	}

/**
 * admin_view method
 *
 * @param string $id
 * @return void
 */
	public function admin_view($id = null) {
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		$this->set('event', $this->Event->read(null, $id));
	}

/**
 * admin_add method
 *
 * @return void
 */
	public function admin_add() {
		if ($this->request->is('post')) {
			$this->Event->create();
			if ($this->Event->save($this->request->data)) {
				$this->flash(__('Event saved.'), array('action' => 'index'));
			} else {
			}
		}
		$projects = $this->Event->Project->find('list');
		$users = $this->Event->User->find('list');
		$this->set(compact('projects', 'users'));
	}

/**
 * admin_edit method
 *
 * @param string $id
 * @return void
 */
	public function admin_edit($id = null) {
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->Event->save($this->request->data)) {
				$this->flash(__('The event has been saved.'), array('action' => 'index'));
			} else {
			}
		} else {
			$this->request->data = $this->Event->read(null, $id);
		}
		$projects = $this->Event->Project->find('list');
		$users = $this->Event->User->find('list');
		$this->set(compact('projects', 'users'));
	}

/**
 * admin_delete method
 *
 * @param string $id
 * @return void
 */
	public function admin_delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
		$this->Event->id = $id;
		if (!$this->Event->exists()) {
			throw new NotFoundException(__('Invalid event'));
		}
		if ($this->Event->delete()) {
			$this->flash(__('Event deleted'), array('action' => 'index'));
		}
		$this->flash(__('Event was not deleted'), array('action' => 'index'));
		$this->redirect(array('action' => 'index'));
	}
}
