<?php
App::uses('AppController', 'Controller');
App::uses('JsonResponse', 'Json.Network');
/**
 * Projects Controller
 *
 */
class ProjectsController extends AppController {

/**
 * Scaffold
 *
 * @var mixed
 */
	public $scaffold;
	

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
