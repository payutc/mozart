<?php

include 'config.php';

// Restriction de l'accéssibilité des cookies
$sessionPath = parse_url($_CONF["mozart_url"], PHP_URL_PATH);
session_set_cookie_params(0, $sessionPath);

session_start();

$POSS = new SoapClient($_CONF['soap_url'].'POSS2.class.php?wsdl');

if(isset($_SESSION['cookies_mozart'])) {
	$POSS->_cookies = $_SESSION['cookies_mozart'];
}

if(isset($_GET['method'])) {
	$method = $_GET['method'];
	echo json_encode(call_user_func_array(array($POSS,$method), $_POST));
}

if(isset($POSS->_cookies)) {
	$_SESSION['cookies_mozart'] = $POSS->_cookies;
}
