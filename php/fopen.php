<?php	//fileopen API for FoodTracker. All logic refer to the javascript file
	$strBasePath = str_replace('php','',dirname(__FILE__));
	//Pre-process 
	$FileFoodFile = $strBasePath . 'fdb/foodlist.txt';
	$FileEatFile = $strBasePath . 'fdb/eatlist.txt';
	$strAction = $_GET['action'];	$strTargetFile = $_GET['list'];
	
	switch (strtolower($strAction))
	{
		case 'getlist':			if ($strTargetFile == 'foodlist')				$strFileOpen = 'FileFoodFile';			else 				$strFileOpen = 'FileEatFile';			
			$Handler = fopen($$strFileOpen, "r");			while (!feof($Handler)) 			{ 				$Data = fgets($Handler, 256); 				print $Data; 			} 
			break;
		case 'writelog':
			$Handler = fopen($FileEatFile, "a");			while($strBuffer = fgets($Handler) !== false){				$strData .= $strBuffer;			}			$objWriteList = json_decode($strData);			var_dump($objWriteList);
			fwrite($Handler, $_GET['data']);
			break;
	}
	
	if ($Handler) fclose($Handler);