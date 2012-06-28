<?php

include 'config.php';
session_start();

$POSS = @new SoapClient($_CONF['soap_url'].'POSS2.class.php?wsdl');

if(isset($_SESSION['cookies'])) { 
	$POSS->_cookies = $_SESSION['cookies'];
} else {
	$_SESSION['cookies'] = $POSS->_cookies;
}

if(isset($_GET['method'])) {
	$method = $_GET['method'];
	echo json_encode(call_user_func_array(array($POSS,$method), $_POST));
}

