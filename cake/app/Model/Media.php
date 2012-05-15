<?php
App::uses('AppModel', 'Model');
/**
 * Media Model
 *
 * @property Project $Project
 */
class Media extends AppModel {
/**
 * Use table
 *
 * @var mixed False or table name
 */
	public $useTable = 'medias';
/**
 * Display field
 *
 * @var string
 */
	public $displayField = 'name';

	//The Associations below have been created with all possible keys, those that are not needed can be removed
		public $actsAs = array('Containable');
	

/**
 * hasMany associations
 *
 * @var array
 */
	public $hasMany = array(
		'Project' => array(
			'className' => 'Project',
			'foreignKey' => 'media_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);

}
