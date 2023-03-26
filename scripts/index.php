<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "../includes/ConnectDB.php";
include "../includes/Result.php";
require "../includes/main.php";


$dbh = ConnectDB();
$R = new Result();

$A = $_REQUEST['a'];

switch ($A){
  case 'writer':
    $R("",true);
    $name= $_REQUEST['name'];
    $stmt = $dbh->prepare("select * from life_writers as t1 left join life_files as t2 on t1.file_id=t2.file_id where t1.writer_name=?");
    $stmt->execute(Array($name));
    $row = $stmt->fetch();
    $R->data=Array('picture'=>$row['file_name']);
    break;
  
}


$dbh = NULL;
print $R;
$R = NULL;
?>