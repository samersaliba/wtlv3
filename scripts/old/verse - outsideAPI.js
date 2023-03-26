$(function () {

    //  function geten(a){
    var mydic = {
        "تكوين": "Genesis",
        "خروج": "Exodus",
        "لاويين": "Leviticus",
        "عدد": "Numbers",
        "تثنية": "Deuteronomy",
        "يشوع": "Joshua",
        "قضاة": "Judges",
        "راعوث": "Ruth",
        "صموئيل": "Samuel",
        "ملوك": "Kings",
        "أخبار": "Chronicles",
        "عزرا": "Ezra",
        "نحميا": "Nehemiah",
        "أستير": "Esther",
        "أيوب": "Job",
        "مزمور": "Psalms",
        "أمثال": "Proverbs",
        "جامعة": "Ecclesiastes",
        "نشيد الأنشاد": "The Song of Solomon",
        "إشعياء": "Isaiah",
        "إرمياء": "Jeremiah",
        "مراثي": "Lamentations",
        "حزقيال": "Ezekiel",
        "دانيال": "Daniel",
        "هوشع": "Hosea",
        "يوئيل": "Joel",
        "عاموس": "Amos",
        "عوبديا": "Obadiah",
        "يونان": "Jonah",
        "ميخا": "Micah",
        "ناحوم": "Nahum",
        "حبقوق": "Habakkuk",
        "صفنيا": "Zephaniah",
        "حجي": "Haggai",
        "زكريا": "Zechariah",
        "ملاخي": "Malachi",
        "متى": "Matthew",
        "مرقس": "Mark",
        "لوقا": "Luke",
        "يوحنا": "John",
        "أعمال الرسل": "Acts",
        "أعمال": "Acts",
        "رومية": "Romans",
        "كورنثوس": "Corinthians",
        "غلاطية": "Galatians",
        "أفسس": "Ephesians",
        "فيلبي": "Philippians",
        "كولوسي": "Colossians",
        "تسالونيكي": "Thessalonians",
        "تيموثاوس": "Timothy",
        "تيطس": "Titus",
        "فيليمون": "Philemon",
        "عبرانيين": "Hebrews",
        "يعقوب": "James",
        "بطرس": "Peter",
        "يهوذا": "Jude",
        "رؤيا": "Revelation"

    };

    var endic = {
        "Genesis":"GEN",
        "Exodus":"EXO",
        "Leviticus":"LEV",
        "Numbers":"NUM",
        "Deuteronomy":"DUE",
        "Joshua":"JOS",
        "Judges":"JDG",
        "Ruth":"RUT",
        "1 Samuel":"1SA",
        "2 Samuel":"2SA",
        "1 Kings":"1KI",
        "2 Kings":"2KI",
        "1 Chronicles":"1CH",
        "2 Chronicles":"2CH",
        "Ezra":"EZR",
        "Nehemiah":"NEH",
        "Esther":"EST",
        "Job":"JOB",
        "Psalms":"PSA",
        "Proverbs":"PRO",
        "Ecclesiastes":"ECC",
        "The Song of Solomon":"SNG",
        "Isaiah":"ISA",
        "Jeremiah":"JER",
        "Lamentations":"LAM",
        "Ezekiel":"EZK",
        "Daniel":"DAN",
        "Hosea":"HOS",
        "Joel":"JOL",
        "Amos":"AMO",
        "Obadiah":"OBA",
        "Jonah":"JON",
        "Micah":"MIC",
        "Nahum":"NAM",
        "Habakkuk":"HAB",
        "Zephaniah":"ZEP",
        "Haggai":"HAG",
        "Zechariah":"ZEC",
        "Malachi":"MAL",
        "Matthew":"MAT",
        "Mark":"MRK",
        "Luke":"LUK",
        "John":"JHN",
        "Acts":"ACT",
        "Romans":"ROM",
        "1 Corinthians":"1CO",
        "2 Corinthians":"2CO",
        "Galatians":"GAL",
        "Ephesians":"EPH",
        "Philippians":"PHP",
        "Colossians":"COL",
        "1 Thessalonians":"1TH",
        "2 Thessalonians":"2TH",
        "1 Timothy":"1TI",
        "2 Timothy":"2TI",
        "Titus":"TIT",
        "Philemon":"PHM",
        "Hebrews":"HEB",
        "James":"JAS",
        "1 Peter": "1PE",
        "2 Peter": "2PE",
        "1 John":"1JN",
        "2 John":"2JN",
        "3 John":"3JN",
        "Jude":"JUD",
        "Revelation":"REV"
    }

    $('p,article li').each(function (index, value) {
        // ([1-2] ?)?([^\s^(^0-9]+) ?([0-9]{1,3}): ([0-9]{1,3})([-، و]+([0-9]{1,3}))?(?![^<]*>|[^<>]*<\/)
        this.innerHTML = this.innerHTML.replace(/([1-2] ?)?([^\s^(^0-9]+) ?([0-9]{1,3}): ([0-9]{1,3})([-، و]+([0-9]{1,3}))?/g,
            function (g0, g1, g2, g3, g4, g5,g6) {
                var verse = '', text = '';
                if (g1!=null) { verse = g1.trim(); text = g1 + " "; }
                verse += mydic[g2] + g3 + ":" + g4;
                text += g2 + " " + g3 + ": " + g4;
                if (g5 != null) { verse += "-" + g6; text += " - " + g6; }
                if (mydic[g2]!=null) return "<span data-verse='" + verse + "'>" + text + "</span>"; else return text;
            });
    });

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.foundVerse>a {cursor: help;text-decoration:none;border-bottom: 3px solid #03B9F3;color:inherit;} .foundVerse>a:hover {text-decoration: none;color: inherit}';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    $('[data-verse]').each(function(index, e) {
        var verse = $(e).data('verse');
        //console.log(verse);
        jQuery.ajax({
            url: 'https://getbible.net/json',
            dataType: 'jsonp',
            data: 'passage=' + verse + '&v=arabicsv',
            cache: true,
            jsonp: 'getbible',
            success: function(json) {
                if (json.type == 'verse') {
                    var direction = (json.direction == 'RTL' ? 'rtl' : 'ltr');
                    var book, output;
                    jQuery.each(json.book, function(index, value) {
                        //book = '<span dir="ltr">' + value.book_name + ' ' + value.chapter_nr + '</span>';
                        output = '<div class="' + direction + '">';
                        jQuery.each(value.chapter, function(index, value) {
                            output += ' <div><small class="ltr text-danger">' + value.verse_nr + '</small>  ' + value.verse + '</div>';
                        });
                        output += '</div>';
                        output += '<div style="padding-top: 0.5em"><a href="https://www.bible.com/ar/bible/14/' + endic[value.book_name] + '.' + value.chapter_nr + '.AVDDV" target="_blank">إقرأ الاصحاح ></a></div>';
                    });
                    var a = $('<a></a>').html($(e).html()).attr('href', 'javascript:void(0)').popover({
                        content: output,
                        html: true,
                        title: $(e).text(), //book
                        placement: 'auto',
                        trigger: 'focus'
                    });
                    $(e).html(a).addClass('foundVerse');
                } else if (json.type == 'chapter') {} else if (json.type == 'book') {
 
                }
            },
            error: function() {
                e.title = "Error getting verse";
            }
        });
    });
    

});