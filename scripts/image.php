<?php

if(isset($_GET['file']))
{
	//Read the filename
  $filename = "/chroot/home/truthlife/way.truth.life/images/".$_GET['file'];
	//Check the file exists or not
	if(file_exists($filename)) {
    
    $extension = pathinfo($filename, PATHINFO_EXTENSION);
    switch ($extension){
    case 'jpg': $mime = 'image/jpg'; break;
    case 'png': $mime = 'image/png'; break;
    case 'gif': $mime = 'image/gif'; break;
    case 'jpeg': $mime = 'image/jpeg'; break;
    }

		//Define header information
		header('Content-Description: Image');
		header('Content-Type: '.$mime);
		//header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		//header("Cache-Control: public"); 
		//header("Expires: 0");
		header('Content-Disposition: inline; filename="'.basename($filename).'"');
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