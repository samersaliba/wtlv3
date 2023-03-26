
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today = new Date();

function formatBooks() {
  if ($(".book").length) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.card {width: 100%;} @media (min-width: 768px) {.card {width: 45%;}} @media (min-width: 992px) {.card {width: 30%;}}';
    document.getElementsByTagName('head')[0].appendChild(style);
    $library=$('main');
    $library.prepend($('<div>',{'class':'input-group'})
      .append($('<input type="text" class="form-control" id="idKeyword" placeholder="ابحث">').on('keyup',doSearch))
      
    );

  
    
    
    
    $(".book").each(function (index, e) {
      //var read = e.href.split('.').length == 1; //console.log(a.pop());
      
      var read = e.href.split('.').pop().length > 3;
      $('<div></div>',{'class':'card shadow m-2'})
        .data('info',{'writer':$(e).data('writer'),'text':$(e).data('text'),'title':e.innerHTML})
        .append(
          $('<h5></h5>',{'class':'card-header'})
            .html(e.innerHTML)
        )
        .append(
          $('<div></div>',{'class':'card-body h-100'})
            .append(
              $('<div></div>',{'class':'media'})
                .append(
                  $('<img />',{'width':'50px'})
                    .addClass('ml-3 rounded-circle align-self-center')
                    //.attr('src', '/images/persons/' + $(e).data('writer-img'))
                    // /scripts/show.php?file=books/'.$file['file_name']
                    .attr('src', '/image/writers/' + $(e).data('writer-img'))
                    .prop('alt', $(e).data('writer'))
                )
                .append(
                  $('<div></div>',{'class':'media-body text-secondary'})
                    .append(
                      ($(e).data('writer-url')==''?
                      $('<div>').text($(e).data('writer')):
                      $('<a>',{'href':$(e).data('writer-url'),'target':'_blank'}).text($(e).data('writer')))
                    )
                )
            )
            .append(
              $('<p></p>',{'class':'card-text'})
                .html($(e).data('text'))
            )
        )
        .append(
          $('<div></div>',{'class':'card-body pt-0'})
            .append(
              $('<a></a>',{'class':'btn btn-primary'})
                .attr('href', e.href)
                .attr('target', read ? '_self' : '_self')
                .text(read ? 'قراءة  ' : 'تنزيل ')
                .append(
                  $('<i></i>',{'class':'ml-2 fas ' + (read ? 'fa-book-open' : 'fa-download')})
                )
            )
            .append($('<span>',{'style':'color:grey;padding-right:20px','dir':'ltr'}).text($(e).data('filesize')))
        ).insertAfter($(e));
      $(this).remove();
    });
    var urlVars = getUrlVars();
		if (typeof urlVars['s'] !== 'undefined') {
			$('#idKeyword').val(decodeURI(urlVars['s'])).trigger('keyup');
		}
  }
}

  function doSearch(){
    //let ext = $('#idExt').val();
    let q = $('#idKeyword').val().toLowerCase();
    //let jid= $('#idJob').val();
    let $a = $('.card');
    var count = 0;
    
    $a.each(function (index){
      let data = $(this).data('info');
      let $this = $(this);
      if (
        (q=='' || (data['writer'].toLowerCase().indexOf(q)!=-1
        || data['text'].toLowerCase().indexOf(q)!=-1
        || data['title'].toLowerCase().indexOf(q)!=-1))
        //&&
        //(data['ext']==ext || ext=='All')
        //&&
        //(data['jid']==jid || jid==0)
      ) { 
          $this.show(); 
          count++;
        } else { 
          $this.hide();
        }
      //$('#idStatus').text(count + '/' + $folder.data('total') + ' Files');

    });
    
  }

function formatArticle() { 
  
  $('sup[data-ref]').each(function(index, e) {
    $(e)
      .append(' ')
      .append($('<a>',{'id':'src'+index,'class':'anchor','style':'position: relative;top: -90px;visibility: hidden;'}))
      .append(
        $('<a>',{'href':'#ref'+index}).text(index+1)
      )
      .attr('title',$(e).data('ref'))
      .attr('z-index','-1')
      ;
      if (index==0) $('main').append($('<div>',{'style':'width: 20%;border-top:1px solid #000;height: 1px'}));
      $('main').append(
        $('<div>',{'class':'footnote'})
          .append($('<a>',{id:'ref'+index,'class':'anchor','style':'position: relative;top: -55px;visibility: hidden;'}))
          .append($('<a>',{'href':'#src'+index})
            .append($('<span>',{'class':'text-danger'}).text(index+1))
          )
          .append(' ')
          .append($('<span>').text($(e).data('ref')))
          .append(($(e).data('url')?
          $('<a>',{'href':$(e).data('url'),'target':'_blank','style':'padding-right: 5px'}).append($('<i>',{'class':'fa fa-share-square'}))
          :null))
      );
  })
  if ($('[data-article-writer]').length) {
    var $e = $('[data-article-writer]');
    console.log($e.data('article-writer'));
    getValue({a: 'writer',name: $e.data('article-writer')}, function (data){
    $('[data-article-writer] address')
      .after(
        $('<div></div>',{'class':'media mb-4'})
          .append(
            $('<img />',{'class':'ml-3 rounded-circle align-self-center','width':'50px'})
              .attr('src', '/image/writers/' + data.data[0].picture) //writerImgs[$e.data('article-writer')])
              .prop('alt', $e.data('article-writer'))
          )
          .append(
            $('<div></div>',{'class':'media-body text-secondary'})
              .html('<div>' + $e.data('article-writer') + '</div>'
                + ($e.data('source') ? '<div><small>' + $e.data('source') + '</small></div>' : '')
                + ($e.data('date') ? '<div><small>' + new Date($e.data('date')).toLocaleDateString("ar-LB", options) + '</small></div>' : '')
              )
          )
      )
      .remove();
    })
  }
}