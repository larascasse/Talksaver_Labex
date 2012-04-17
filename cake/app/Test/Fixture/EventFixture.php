<?php
/**
 * EventFixture
 *
 */
class EventFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary'),
		'type' => array('type' => 'string', 'null' => false, 'default' => NULL, 'key' => 'index', 'collate' => 'latin1_swedish_ci', 'charset' => 'latin1'),
		'query' => array('type' => 'string', 'null' => false, 'default' => NULL, 'collate' => 'latin1_swedish_ci', 'charset' => 'latin1'),
		'start' => array('type' => 'integer', 'null' => false, 'default' => NULL),
		'end' => array('type' => 'integer', 'null' => false, 'default' => NULL),
		'start_utc' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
		'end_utc' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
		'project_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20),
		'user_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20),
		'modified' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
		'created' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'type' => array('column' => array('type', 'start', 'end', 'project_id'), 'unique' => 0)),
		'tableParameters' => array('charset' => 'latin1', 'collate' => 'latin1_swedish_ci', 'engine' => 'MyISAM')
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'type' => 'Lorem ipsum dolor sit amet',
			'query' => 'Lorem ipsum dolor sit amet',
			'start' => 1,
			'end' => 1,
			'start_utc' => '2012-04-16 10:34:07',
			'end_utc' => '2012-04-16 10:34:07',
			'project_id' => 1,
			'user_id' => 1,
			'modified' => '2012-04-16 10:34:07',
			'created' => '2012-04-16 10:34:07',
			'indexes' => '2012-04-16 10:34:07'
		),
	);
}
