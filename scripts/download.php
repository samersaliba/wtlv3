<?php

if(isset($_GET['file']))
{
	//Read the filename
  $filename = "/chroot/home/truthlife/way.truth.life/images/".$_GET['file'];
	//Check the file exists or not
	if(file_exists($filename)) {

		//Define header information
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: public"); 
		header("Expires: 0");
		header('Content-Disposition: attachment; filename="'.basename($filename).'"');
		header('Content-Length: ' . filesize($filename));
		header('Pragma: public');
		header("Content-Transfer-Encoding: binary");

		//Clear system output buffer
		flush();

		//Read the size of the file
		readfile($filename);

		//Terminate from the script
		die();
	} else {
		http_response_code(404);
		die();
		//echo "File does not exist.";
	}
} else {
	//echo "Filename is not defined."
	die("Filename is not defined.");
}

?>