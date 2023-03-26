<?php

/*
articles
  علوم
  مدونة
  حقائق: روحيات
  اسلاميات؟
  كتب
  
Each article has folder for children article to create its path
Each article has path that is used to identify it and access it with a button to auto generate from folders


*/

include "../includes/ConnectDB.php";
require "../includes/main.php";
$dbh = ConnectDB();



if (isset($_GET['uid'])){
  $uid = str_replace('/','',$_GET['uid']);
  $stmt = $dbh->prepare("select * from life_articles where (article_uid=? or article_id=19) and article_deleted='N' order by article_timestamp desc limit 1");
  $stmt->execute(Array($uid));
  $article = $stmt->fetch();
} 

if (isset($_GET['path'])){
  $path = $_GET['path'];
  $stmt = $dbh->prepare("select * from life_articles where (article_path=? or article_id=19) and article_deleted='N' order by article_timestamp desc limit 1");
  $stmt->execute(Array(fixpath($path)));
  $article = $stmt->fetch();
}


$stmt2 = $dbh->prepare("select * from life_writers where writer_id=?");
$stmt2->execute(Array($article['writer_id']));
$writer = $stmt2->fetch();

$article['article_picture'] = getField($article['file_id'],'file_id','file_name' ,'life_files');


require "../includes/head.php";
require "../includes/pagesintro.php";
require "../includes/pagessitemap.php";
//require "../includes/gototop.php";

//echo dirname(__FILE__);

?>

<!-- Content Start -->
<p>&nbsp;</p>
<section class="container text-right">
    <div class="row d-flex flex-wrap">
        <article class="col-md-<?php if ($article['article_sidemenu']=='Y') echo '9'; else echo '12'; ?> pb-1" data-article-writer="<?php echo $writer['writer_name'] ?>" data-source="<?php echo $article['article_source'] ?>">
            <header>
                <h3><?php echo $article['article_title'] ?></h3>
                <address><?php echo $article['article_introline2'] ?></address>
            </header>
            <main>
                <?php echo $article['article_text'] ?>
            </main>
            <footer>
            <?php prevnext($article['article_id']); ?>
            </footer>
        </article>
        <?php if ($article['article_sidemenu']=='Y') {?>
        <div class="col-md-3">
            <div class="sidebar sticky1" id="sidebar">
                <?php include "../includes/pagesside.php"; ?>
            </div>
        </div>
        <?php } ?>
    </div>
</section>
<p>&nbsp;</p>
<!-- Content End -->

<?php
include "../includes/foot.php";
?>

