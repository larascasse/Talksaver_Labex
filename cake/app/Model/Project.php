<?php
App::uses('AppModel', 'Model');

/**
 * Project Model
 *
 */
class Project extends AppModel {
/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'name';
	var $belongsTo = 'User,Media'; 
/**
 * Validation rules
 *
 * @var array
 */
	public $validate = array(
		'name' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				//'message' => 'Your custom message here',
				//'allowEmpty' => false,
				//'required' => false,
				//'last' => false, // Stop validation after this rule
				//'on' => 'create', // Limit validation to 'create' or 'update' operations
			),
		),
	);
	
}
