<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "./includes/ConnectDB.php";
require "./includes/main.php";
$dbh = ConnectDB();

list($article,$writer)=getPage('Rem5uyYCoTbbsqk');

require "./includes/head.php";
require "./includes/intro.php";
require "./includes/pagessitemap.php";
?>
<!-- Content Start -->
<style>
    section footer {
        margin-bottom: 1em;
        border-bottom: 1px solid #aaaaaa;
        padding-bottom: 1em;
    }
	
	.list-group-item p {
		font-family: 'Tajawal', sans-serif;
	}
</style>
<p>&nbsp;</p>
<section class="container text-right">
    <div class="row d-flex flex-wrap">
        <div class="col-md-8 pb-1">
		  <?php style(getLatestID()[0],2); ?>
		  <hr/>
          <article>
            <div class="mb-3">
                <h5>لماذا يجب الاهتمام بالحياة الروحية؟</h5>
                <p>نحن لسنا اجساد ولنا حياة روحية، بل نحن ارواح ولنا حياة جسدية. فالإهتمام بالحياة
                    الروحية يجب أن يكون من الإهتمامات الأساسية
                    التي تؤثّر على حياتنا الحالية وكيفيّة عيشها، وأيضا لها تأثير على الحياة الأبدية. فإن معرفة الحقيقة
                    شيء أساسي نحصل عليها من خلال بحث عن الأجوبة بشكل جدّي وبمثابرة.
                </p>
                <a href="<?php echo getURL('tvLUFfgnZFWkVqj')?>">المزيد</a>
            </div>
          </article>
            <hr>
          <?php style('tvLUFfgnZFWkVqj',3);?>
          <?php style('zA6B1NnsnsUACFY',1);?>
          <?php style('5j5XhlYQpMXdtEM',2);?>

        </div>
        <div class="col-md-4">
          <div class="sidebar sticky1" id="sidebar">
			<?php style('bible',4);?>
            <div class="shadow-sm mb-3">
              <div class="bg-blue p-1 text-white rounded-top">مواضيع مهمة</div>
              <div class="bg-white p-1">
              <ul>
                <li><?php echo getlink('sfS25OYKAGyVFsM')?></li>
                <li><?php echo getlink('5j5XhlYQpMXdtEM')?></li>
                <li><?php echo getlink('5mPyUpFRvIP0wOo')?></li>
              </ul>
            </div>
          </div>
<!--
            <div class="shadow-sm mb-3">
                <div class="bg-blue p-1 text-white rounded-top">&nbsp;</div>
                <div class="container bg-white">
                    <div class="row p-3">
                        <div class="col">
                            <img src="/images/pp.png" width="100">
                        </div>
                        <div class="col">
                            جمعية رعاية الاولاد روحيا
                        </div>
                    </div>
                </div>
            </div>
-->
            <div class="shadow-sm mb-3">
                <div class="list-group">
                  <div class="bg-blue p-1 text-white rounded-top">مدونة</div>
					<?php
					$stmt = $dbh->prepare("SELECT * FROM life_articles where article_type='Article' order by article_date desc limit 1,5");
					$stmt->execute();
					while ($row = $stmt->fetch()){
						echo '<a class="list-group-item list-group-item-action list-group-item-light" href="'.$row['article_path'].'"><span class="text-dark">'.$row['article_title'].'</span><p>'.$row['article_desc'].'</p></a>';
					}
					?>
                </div>
            </div>
          </div>
        </div>
    </div>
</section>
<p>&nbsp;</p>
<!-- Content End -->

<?php
include "./includes/foot.php";
?>
