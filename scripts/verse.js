/*!
 * jQuery Verse Plugin v1.0.0
 * 
 *
 * Copyright 2021 Samer Saliba
 * Released under the MIT license
  */
(function ($) {
  $.fn.verse = function() {
    var oldg2,aa=0;
    
    $(this).each(function (index, value) {
      return verseScan(this);
    });
    
    
    function verseScan(elem){
      elem.innerHTML = elem.innerHTML.replace(/([1-2] ?)?([^>^\s^(^0-9]+) ?([0-9]{1,3}): ([0-9]{1,3})([-–، و]+([0-9]{1,3}))?/g,
        function (g0, g1, g2, g3, g4, g5,g6) {
          let verse = '', text = '', book='';
          if (g2=='؛') { book=oldg2; c='؛ '; g2=''; } else { book=g2; c=''; oldg2=g2;}
          //console.log(++aa,g2);
          if (g1!=null) { verse = g1.trim(); text = g1 + " "; }
          verse += book + '|' + g3 + "|" + g4;
          text += g2 + " " + g3 + ": " + g4;
          if (g5 != null) { verse += "-" + g6; text += " - " + g6; }
          return c + "<span data-verse='" + verse + "'>" + text + "</span>"; //else return text;
        });
      return elem;
    }

    var style = document.createElement('style');
    style.type = 'text/css';
    //style.innerHTML = '.notFoundVerse {background-color: #fff0f0} .foundVerse>a {cursor: help;text-decoration:none;border-bottom: 3px solid #03B9F3;color:inherit; white-space:nowrap;} .foundVerse>a:hover {text-decoration: none;color: inherit}';
	style.innerHTML = '.notFoundVerse {background-color: #fff0f0} .foundVerse>a {cursor: help;text-decoration:none;font-size: 200%; color:inherit; white-space:nowrap;} .foundVerse{font-size: 50%; border-bottom: 3px solid #03B9F3;}';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    $('[data-verse]').each(function(index, e) {
      var verse = $(e).data('verse');
      jQuery.ajax({
        url: 'https://way.truth.life/includes/verse.php',
        //dataType: 'jsonp',
        data: {'passage': verse ,'v':'arsvd'},
        cache: true,
        //jsonp: 'getbible',
        success: function(json) {
          if (json.status == true) {
            //console.log(json);
            var direction = (json.direction[0] == 'RTL' ? 'rtl' : 'ltr');
            var output = '<div class="' + direction + '">';
            let b,c;
            jQuery.each(json.data, function(index, value) {
              //book = '<span dir="ltr">' + value.book_name + ' ' + value.chapter_nr + '</span>';
              output += ' <div><small class="' + direction + ' text-danger">' + value.verse_nr + '</small>  ' + value.verse + '</div>';
              b= value.book_nr;
              c= value.chapter_nr;
              
            });
            output += '</div>';
            //output += '<div style="padding-top: 0.5em"><a href="https://www.bible.com/ar/bible/14/' + value.book_name + '.' + value.chapter_nr + '.AVDDV" target="_blank">إقرأ الاصحاح ></a></div>';
            output += '<div style="padding-top: 0.5em"><a href="https://way.truth.life/l/bible/?b=' + b + '&c=' + c + '" target="_blank">إقرأ الاصحاح ></a></div>';
            var a = $('<a>').html($(e).html()).attr('href', 'javascript:void(0)').popover({
              content: output,
              html: true,
              title: $(e).text(), //book
              placement: 'auto',
              trigger: 'focus'
            });
            $(e).html(a).addClass('foundVerse');
          } else {
            console.log(json.msg);
            $(e).addClass('notFoundVerse');
          }
        },
        error: function(a) {
          console.log(a.responseText);
          e.title = "Error getting verse";
          $(e).addClass('notFoundVerse');
        }
      });
    });
  }
}(jQuery));