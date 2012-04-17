<?php
App::uses('AppModel', 'Model');
/**
 * Event Model
 *
 * @property Project $Project
 * @property User $User
 */
class Event extends AppModel {
/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'query';

	//The Associations below have been created with all possible keys, those that are not needed can be removed

/**
 * belongsTo associations
 *
 * @var array
 */
	public $belongsTo = array(
		'Project' => array(
			'className' => 'Project',
			'foreignKey' => 'project_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'User' => array(
			'className' => 'User',
			'foreignKey' => 'user_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);
}
