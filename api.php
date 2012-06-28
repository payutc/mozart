<?php

include 'config.php';
session_start();

$POSS = @new SoapClient($_CONF['soap_url'].'POSS2.class.php?wsdl');

if(isset($_GET['method'])) {
	$method = $_GET['method'];
	echo json_encode(call_user_func_array(array($POSS,$method), $_POST));
}

if(isset($_SESSION['cookies_mozart'])) { 
	$POSS->_cookies = $_SESSION['cookies_mozart'];
} else {
	$_SESSION['cookies_mozart'] = $POSS->_cookies;
}
