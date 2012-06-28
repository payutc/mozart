<?php

include 'config.php';

$POSS = @new SoapClient($_CONF['soap_url'].'POSS2.class.php?wsdl');

if(isset($_GET['method'])) {
	$method = $_GET['method'];
	echo json_encode(call_user_func_array(array($POSS,$method), $_POST));
}

