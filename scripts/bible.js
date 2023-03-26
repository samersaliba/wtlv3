var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = 

 '@import url("https://fonts.googleapis.com/css2?family=Amiri&display=swap");'
+ '#myBible {font-family: Amiri, sans-serif}'
+ '#myBible input, #myBible select {font-family: Tajawal, sans-serif}'
+ '.scriptText {padding-top: 20px} .scriptText small,.scriptText .verseRef {padding-left: 5px;font-family: Tajawal, sans-serif}'
+ '.scriptText small {border: 1px solid #777;border-radius: 6px;padding-right: 5px; margin-right: 3px; margin-left: 3px;}'
+ '@media (max-width:600px){.scriptText small {border: 1px solid #777;border-radius: 6px;padding-right: 5px;padding-top:3px; padding-bottom:-1px; margin-right: 3px; margin-left: 3px;}}'
+ '.hlYellow {background-color:#fffdc9; border: 1px solid #f5f3bf;border-radius: 2px;}'
+ '.hlLtYellow {background-color:#fffed9;}'
+ '.nonselect {-webkit-user-select: none;-moz-user-select: none; -ms-user-select: none; user-select: none;}'
+ '.vselected {border-bottom1: 1px dashed #999;background-color: #fffdc9}'
+ '#myBible .btn {border:1px solid #ddd}'
+ '.showInline .verseLine {display: inline} .showInline {text-align: justify; text-justify: inter-word;}'
+ '.verseLine {padding-left: 3px;cursor: pointer}'
+ '#idRef {font-size: 2em;padding-left: 10px}'
+ '#idChap {font-size: 2em}'
+ '.newLine {float: right; clear: right;font-size: 4.8em !important;padding-left: 15px} ' 
+ '.newLineRef {display: block} ' 
;

document.getElementsByTagName('head')[0].appendChild(style);

var $books = $('<select>',{'class':'form-control','id':'idBook'})

$books.on('change',function(){
  getChapters();
});

var $chapters =$('<select>',{'class':'form-control','id':'idChapter'});
    //.append($('<option>',{'value':''}).text('اصحاح'));
$chapters.on('change',function(){
  var vars = getUrlVars();
  if (typeof vars['v'] !=='undefined') {
    let v=vars['v'];
    getVerse(v);
  } else {
    
    getText();
  }

});

var searchTimeout;
var $search = $('<input>',{'type':'text','class':'form-control','id':'idSearch','placeholder':'بحث'});
$search.on('keyup focus',function(){
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(search,1000);
});

var $text = $('<div>',{'class':'scriptText'});

$Bible = $('#myBible');
$Bible
 .append($('<div>',{'class':'row'})
  .append($('<div>',{'class':'input-group col-md-4'})
   .append($books)
  )
  .append($('<div>',{'class':'input-group col-md-4'})
   .append($chapters)
  )
  .append($('<div>',{'class':'input-group col-md-4'})
   .append($search)
  )
 )
 .append($('<div>',{'class':'row','style':'padding-top:5px'})
  .append($('<div>',{'class':'input-group col-md-8'})
    
  )
  .append($('<div>',{'class':'input-group col-md-4','dir':'ltr'})
    .append($('<div>',{'class':'btn-group'})
      .append($('<button>',{'type':'button','class':'btn btn-light','id':'idCopy','disabled':'true','title':'Copy'})
        .append($('<i>',{'class':'fa fa-copy'}))
        .on('click',function(){
            let copy='',verses = '', thisVerse='',fv=0,lv=0;
            $text.find('.vselected').each(function(){
                thisVerse = parseInt($(this).data('verse'));
                copy += $(this).data('verse').toIndiaDigits() + ' ' + $(this).text() + ' ';
                if (fv==0) {
                  fv = thisVerse;
                  lv = thisVerse;
                  verses = fv;
                } else {
                  if (thisVerse==lv+1) {
                    lv = thisVerse;
                  } else {
                    if (lv>fv) verses += (lv==fv+1?'، ':' - ') + lv ;
                    verses += ', ' + thisVerse;
                    lv = thisVerse;
                    fv = thisVerse;
                  }
                }
              }
            );
            if (lv>fv) verses += (lv==fv+1?'، ':' - ') + lv ;
            copy += (' (' + $books[0].options[$books[0].selectedIndex].text + ' ' + $chapters.val() + ': ' + verses + ')').toIndiaDigits();
            
            const el = document.createElement('textarea');
            el.value = copy;
            document.body.appendChild(el);
            el.select();
            el.setSelectionRange(0, 99999);
            document.execCommand('copy');
            document.body.removeChild(el);
        })
      )
      .append($('<button>',{'type':'button','class':'btn btn-light','id':'idClear','disabled':'true','title':'Clear selection'})
        .on('click',function(){
          $text.find('.vselected').each(function(){
            $(this).toggleClass('vselected');
            $('#idCopy').prop('disabled',true);
            $('#idClear').prop('disabled',true);
          });
        })
        .append($('<i>',{'class':'fa fa-times'}))
      )
      .append($('<button>',{'type':'button','class':'btn btn-light','id':'idPara','title':'Layout'})
        .on('click',function(){
          $('.scriptText').toggleClass('showInline');
          $(this).find('i').toggleClass('fa-align-justify fa-align-right');
          $('#idChap').toggleClass('newLine');
          $('#idRef').toggleClass('newLineRef');
          //$(this).data('state','Paragraph');
        })
        .append($('<i>',{'class':'fa fa-align-justify'}))
      )
    )
  )
 )
 .append($('<span>',{'id':'idRef'}))
 .append($('<span>',{'id':'idChap'}))

 .append($text)
 .addClass('nonselect');
 
 (function ($) {
    getBooks();
 }(jQuery));

 
 function getBooks(){
  $.ajax({
		url: "/includes/verse.php",
		method: 'POST',
		data: {'a':'books','lang':'ar'},
		cache: false
	}).done(function(data){
    if (data.status){
      let b=43;
      var vars = getUrlVars();
      if (typeof vars['b'] !=='undefined') b=vars['b'];
    
			for (var i = 0;i < data.data.length;i++){
				$books.append(new Option(data.data[i].text, data.data[i].id, false, data.data[i].id==b));
			}
      $books.trigger('change');
		}
    
  });
 }
 
 function getChapters(){
  $.ajax({
		url: "/includes/verse.php",
		method: 'POST',
		data: {'a':'chapters','lang':'ar','b':$books.val()},
		cache: false
	}).done(function(data){
    if (data.status){
      $chapters.empty();
      let c=1;
      var vars = getUrlVars();
      if (typeof vars['c'] !=='undefined') c=vars['c'];
      //$chapters.append(new Option('اصحاح', 0, false, false));
			for (var i = 0;i < data.data.length;i++){
				$chapters.append(new Option(data.data[i].text, data.data[i].id, false, data.data[i].id==c));
			}
      if ($chapters.data('val')!==undefined){
        $chapters.val($chapters.data('val')).trigger('change');
        $chapters.removeData('val');
      } else {
        $chapters.trigger('change');
      }
		}
    
  });
 }
 
 
 function getText(){
  window.history.pushState("","", '?b='+$books.val()+'&c='+$chapters.val());
  $.ajax({
		url: "/includes/verse.php",
		method: 'POST',
		data: {'a':'text','lang':'ar','b':$books.val(),'c':$chapters.val()},
		cache: false
	}).done(function(data){
    console.log(data);
    if (data.status){
      if (data.data){
        $text.clear();
        $('#idRef').text(($books[0].options[$books[0].selectedIndex].text).toIndiaDigits());
        $('#idChap').text($chapters.val().toIndiaDigits());
        $('#idRef,#idChap').show();
        let addClass = ($('#idPara').find('i').hasClass('fa-align-justify')?'':'');
        for (var i = 0;i < data.data.length;i++){
          $text.append($('<div>',{'class':'verseLine'})
              .on('click',function(){
                
                $(this).find('span').toggleClass('vselected');
                let disabled = !$text.find('.vselected').length;
                $('#idCopy,#idClear').prop('disabled',disabled);
                
              })
            .addClass(addClass)
            .append($('<small>',{'class':'rtl text-danger','class':'text-danger'}).text(data.data[i].verse.toIndiaDigits()))
            .append($('<span>').data('verse',data.data[i].verse)
              .append(data.data[i].text)
              .append(data.data[i].el=='Y'?'<br>':'')
            )
          )
        }
			}
		}
    
  });
 }
 
 function getVerse(v){
  $.ajax({
		url: "/includes/verse.php",
		method: 'POST',
		data: {'a':'verse','lang':'ar','b':$books.val(),'c':$chapters.val(),'v':v},
		cache: false
	}).done(function(data){
    if (data.status){
      $text.clear();
      $('#idRef,#idChap').hide();
      if (data.data){
        
        for (var i = 0;i < data.data.length;i++){
          let booknum = data.data[i].booknum;
          let chapter = data.data[i].chapter;
          

          var text = data.data[i].text;
          
          
          $text.append($('<div>',{'style':'cursor: pointer'}).on('dblclick', function(){
            console.log(this);
            })
            .append($('<span>',{'class':'rtl text-danger verseRef'})
              .text((data.data[i].book+ ' ' + data.data[i].chapter + ': ' + data.data[i].verse).toIndiaDigits())
            )
            .append($('<span>',{'class':'verseText'}).append(text)).data('verse',data.data[i].verse)
            .on('click',function(){
              
                $(this).find('span').toggleClass('vselected');
                let disabled = !$text.find('.vselected').length;
                $('#idCopy,#idClear').prop('disabled',disabled);
            })
          )
        }
      } else {
        $text.append($('<span>',{'style':'font-family: Tajawal, sans-serif;','class':'text-secondary'}).text('لا يوجد نتائج للبحث'));
      }
		}
    
  });
 }
 
 function search(){
  if ($search.val()=='') return;
  $.ajax({
		url: "/includes/verse.php",
		method: 'POST',
		data: {'a':'search','lang':'ar','s':$search.val()},
		cache: false
	}).done(function(data){
    if (data.status){
      $text.clear();
      $('#idRef,#idChap').hide();
      var search = $search.val();
      var words = search.split(' ');
      if (data.data){
        
        for (var i = 0;i < data.data.length;i++){
          let booknum = data.data[i].booknum;
          let chapter = data.data[i].chapter;

          var text = data.data[i].text;
          if (text.search(search)>=0){
            text = text.replace($search.val(),'<span class="hlYellow">'+search+'</span>')
          } else {
            words.forEach(function(value,index,array){
              text = text.replace(value,'<span class="hlLtYellow">'+value+'</span>');
            });
          }
          
          $text.append($('<div>',{'style':'cursor: pointer'}).on('dblclick', function(){
            console.log(this);
            })
            .append($('<span>',{'class':'rtl text-danger verseRef'})
              .text((data.data[i].book+ ' ' + data.data[i].chapter + ': ' + data.data[i].verse).toIndiaDigits())
            )
            .append($('<span>',{'class':'verseText'}).append(text))
            .on('click',function(){
              window.history.pushState("","", '?b='+booknum+'&c='+chapter);
              $books.val(booknum).trigger('change');
              $chapters.data('val',chapter);
            })
          )
        }
      } else {
        $text.append($('<span>',{'style':'font-family: Tajawal, sans-serif;','class':'text-secondary'}).text('لا يوجد نتائج للبحث'));
      }
		}
    
  });
 }
 
 String.prototype.toIndiaDigits= function(){
  var id= ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  
  return this.replace(/[0-9]/g, function(w){
    return id[+w]
  });
} 

$.fn.clear = function() {
  $(this).empty();
  $('#idCopy').prop('disabled',true);
  $('#idClear').prop('disabled',true);
  
}
