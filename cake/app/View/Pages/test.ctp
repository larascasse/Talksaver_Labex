Test Static Page

<?php
	if (version_compare(PHP_VERSION, '5.2.8', '>=')):
		echo '<span class="notice success">';
			echo __d('cake_dev', 'Your version of PHP is 5.2.8 or higher.');
		echo '</span>';
	else:
		echo '<span class="notice">';
			echo __d('cake_dev', 'Your version of PHP is too low. You need PHP 5.2.8 or higher to use CakePHP.');
		echo '</span>';
	endif;
?>
</p>