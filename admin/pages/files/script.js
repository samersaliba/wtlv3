$(function() {
	init(); //initialize page
	//addModal('files-o');
	
	//Upload
	$folderupload = $('#folderupload').upload();
	$folderupload.upload('showFiles');
  
  //Load required css file
	let cssLink = $("<link>");
	$("head").append(cssLink); //IE hack: append before setting href
	cssLink.attr({
		rel:  "stylesheet",
		type: "text/css",
		href: "styleh.css"
	});
    
  //Select menu init
	$('#idExt,#idCat').each(fillSelect);
  
  $('#idCat').on('change', function(e){
    $folderupload.upload({'cat': $("#idCat").val()});
  });
  
  var $folder = $('#folder1');
  /*
  $('#idKeyword').on('keyup', function(e){
    doSearch();
  });
  
  $('#idExt,#idJob').on('change', function(e){
    doSearch();
  });


  $(".desc").on('click',function () {
    console.log('click');
    var $title = $(this).find(".title");
    if (!$title.length) {
      $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
    } else {
      $title.remove();
    }
  })
 ;
 */
  
  function doSearch(){
    let ext = $('#idExt').val();
    let q = $('#idKeyword').val().toLowerCase();
    let jid= $('#idJob').val();
    let $a = $('.gallery');
    var count = 0;
    
    $a.each(function (index){
      let data = $(this).data('info');
      let $this = $(this);
      if (
        (q=='' || (data['file'].toLowerCase().indexOf(q)!=-1
        || data['desc'].toLowerCase().indexOf(q)!=-1))
        &&
        (data['ext']==ext || ext=='All')
        &&
        (data['jid']==jid || jid==0)
      ) { 
          $this.show(); 
          count++;
        } else { 
          $this.hide();
        }
      $('#idStatus').text(count + '/' + $folder.data('total') + ' Files');

    });
    
  }
  
  //getFiles();
  function getFiles(){
    
    getValue({action: "listFiles",id: 0},function(data){
      if (data.status){
				if (data.data){
						let $temp,$title,length = data.data.length;
            $folder.data('total',length);
            $('#idStatus').text(length + '/' + length+ ' Files');

						for (let i = 0;i < length;i++){
              let fdata = data.data[i];
              let sSrc = ''; //image src
							$title = fdata['file'] 
								+ (fdata['desc']? "\r\n" + fdata['desc']:'') 
                + "\r\nJob N" + fdata['jid']
								+ "\r\n" + fdata['datetime']
								+ "\r\n" + fdata['user']
								+ "\r\n" + fileSizeFormat(fdata['size'])
								;
							$temp =  $('<div>',{'class':'gallery','title':$title});
							switch(fdata['ext']){
							case 'JPG':
							case 'PNG':
                sSrc = '/admin/script/get.php?file=N' + fdata['jid'] + '/thumb/' + fdata['thumb'];
								$temp.append($('<a>',
									{'href':'/admin/script/get.php?file=N' + fdata['jid'] + '/' + fdata['file'],  
									'data-lightbox':'example-set', 'data-title':$.trim(fdata['desc']) + ' - N' + fdata['jid']})
									.append($('<img>',{'realsrc':sSrc}))
									);
								//temp += '<img class="examlpe-image" src="/admin/script/get.php?file=N' + fdata['jid'] + '/thumb/' + fdata['thumb'] + '" alt="">';
								//temp += '</a>';
							break;
							case 'PDF':
							case 'XLS':
							case 'XLSX':
							case 'TXT':
							case 'CSS':
							case 'DOC':
							case 'DOCX':
							case 'ZIP':
							case 'DWG':
								sSrc = '/admin/res/img/' + fdata['ext'] + '.png';
                $temp.append($('<img>',{'src':sSrc}));
                
							break;
							}
							$temp.append(
                  $('<div>', {'class':'desc'}).text($.trim(fdata['file']))
                  .on('click',function () {
                    Swal.fire({
                      title: fdata['file']  ,
                      html: '<div style="text-align:left">' 
                      + '<a href="/admin/pages/job/?s=N' + fdata['jid'] + '">Job N' + fdata['jid'] + '</a>'
                      + "<br>Date added: " + fdata['datetime']
                      + "<br>Added by: " + fdata['user']
                      + "<br>Size: " + fileSizeFormat(fdata['size'])
                      + '</div>'
                      + (fdata['desc']? '<div class="infonote">' + fdata['desc'] + '</div>':'') 
                      //+ '<br>') + '</div>',
                      ,
									//icon: 'info',
                  imageUrl: sSrc,
                  imageWidth: 128,
                  imageHeight: 128,
                  showCancelButton: true,
                  cancelButtonText: 'Cancel',
                  //cancelButtonColor: 'blue',
                  focusCancel: true,
                  
									confirmButtonText: '<i class="fa fa-download"></i>',
								}).then((result) => {
                  console.log(result);
                /* Read more about isConfirmed, isDenied below */
                //Swal.fire('Saved!', '', 'success');
                  if (result.value) {
                    //Swal.fire('Saved!', '', 'success');
                    window.location.href ='/admin/script/download.php?file=N' + fdata['jid'] + '/' + fdata['file'];
                  }
                });
    /*
    if (!$title.length) {
      $(this).append('<span class="title">' + $(this).parent().attr("title").replace(/\r\n/g,'<br>') + '</span>');
    } else {
      $title.remove();
    }
    */
              })
                )
								.data('info',fdata);
							$folder.append($temp);
						}
            refresh_handler();
				}
			} else {
				toastr["error"](data.msg);
			}
    })
  }
 /* 
for (let i=0;i<30;i++){
          $("#folder").append(
            $('<div>')
              .css({'width':'128px','height':'200px','margin':'5px'})
              .append(
                $('<img>',{width:'128px',height:'128px'})
               )
               .append (
                $('<div>').text(i)
                
               )
          );
        }
	*/
	
	
  //Lazyload
  refresh_handler = function(e) {
    var elements = document.querySelectorAll("*[realsrc]");
    for (var i = 0; i < elements.length; i++) {
      var boundingClientRect = elements[i].getBoundingClientRect();
      if (elements[i].hasAttribute("realsrc") && boundingClientRect.top < window.innerHeight) {
        elements[i].setAttribute("src", elements[i].getAttribute("realsrc"));
        //console.log (elements[i].getAttribute("realsrc"));
        elements[i].removeAttribute("realsrc");
        
      }
    }
  };

  //window.addEventListener('scroll', refresh_handler);
  ////window.addEventListener('load', refresh_handler); wait till grid get elements from database
  //window.addEventListener('resize', refresh_handler);
  
  
    
	

});

