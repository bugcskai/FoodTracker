<?php
	$strBasePath = str_replace('php','',dirname(__FILE__));
	//Pre-process 
	$FileFoodFile = $strBasePath . 'fdb/foodlist.txt';
	$FileEatFile = $strBasePath . 'fdb/eatlist.txt';
	$strAction = $_GET['action'];
	
	switch (strtolower($strAction))
	{
		case 'getlist':
			$Handler = fopen($$strFileOpen, "r");
			break;
		case 'writelog':
			$Handler = fopen($FileEatFile, "a");
			fwrite($Handler, $_GET['data']);
			break;
	}
	
	if ($Handler) fclose($Handler);