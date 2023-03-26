$(function() {
	init(); //initialize page
	addModal('folder-o');
	
  var parentPath = '';
  
	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'listArticles'}
		},
		columns: [
      { render: operateFormatter },
      { "title": "Date", "data": 13, "searchable": false, "width":"45px" },
			{ "title": "Parent ID", "data": 1, "searchable": false },
      { "title": "UID", "data": 2, "searchable": true },
      { "title": "Type", "data": 15, "searchable": true, "width":"20px" },
      { "title": "Title", "data": 3, "searchable": true, "width":"150px", render: function ( data, type, row ) {
					if (row[14]=='Y') return '<i class="fa fa-close"></i> ' + data ; 
          else return data;
				}}, 
      { "title": "Intro line 1", "data": 6, "searchable": false, "width":"200px" },
      { "title": "Intro line 2", "data": 7, "searchable": false, "width":"200px" },
      { "title": "Picture", "data": 8, "searchable": false, "width":"100px" },
      { "title": "Writer", "data": 9, "searchable": false, "width":"100px" },
      { "title": "Source", "data": 10, "searchable": false, "width":"200px" },
      { "title": "Path", "data": 12, "searchable": false, "width":"200px" },
      { "title": "Keywords", "data": 5, "searchable": false, "width":"200px" }
      
    ],
		"order": [[ 1, "desc" ]],
    //autoWidth: false,
		columnDefs: [
      
        { "width": "50px", "targets": 1 },
      
      
			{
				render: overflowHandle,
        targets: [4]
      },
			{
				"searchable": false,
				"orderable": false,
				"targets": 0
			},
			{
				"visible": false,
				"targets": []
			}
		]
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
  

	//App buttons
	drawButtons();

	//App buttons ext
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal
		
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 
			
			//Get new UID	
      getValue({action:"getNewUID"},function(data){
        if (data.status){ $("#idUID").val(data.data[0].uid); } else { toastr["error"](data.msg); }
      })
      parentPath = '';
      
		} else if ($e.hasClass("open")) {
      $('.modal-footer>button[type="submit"]').prop( "disabled", true );
      
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
      $("#idArticle").text(row[0]);
			$("#idDate").val(row[13]);
			$("#idParent").val(row[1]);
      $("#idUID").val(row[2]);
      $("#idType").val(row[15]);
      $("#idTitle").val(row[3]);
      $("#idDesc").val(row[4]);
      $("#idKeywords").values(row[5]);
      $("#idIntroLine1").val(row[6]);
      $("#idIntroLine2").val(row[7]);
      //$("#idPicture").val(row[8]);
      $("#idWriter").val(row[9]);
      $("#idSource").val(row[10]);
      $("#idFolder").val(row[11]);
      $("#idPath").val(row[12]);
      $("#idDeleted").val(row[14]);
      $("#idPicture").val(row[16]);
      $("#idText").val('');
      
      
      getValue({action:"getText",'id':row[0]},function(data){
        if (data.status){ 
          $("#idText").val(data.data[0].text).trigger('change');  
          $('.modal-footer>button[type="submit"]').prop( "disabled", false );
        } else { 
          toastr["error"](data.msg); 
        }
      })
      
      
		}
		if ($e.is('.new,.open')) $('#idParent,#idWriter,#idPicture,#idKeywords,#idDesc,#idTitle,#idIntroLine1,#idIntroLine2,#idPath').each(function(){ $(this).trigger('change'); }); //select2/mask elements
	})
	
	
	//Select menu init
	$('#idParent,#idWriter,#idType,#idKeywords,#idPicture').each(fillSelect);

	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editArticle'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteArticle");
	
	//Active Form Updates on change
  $('#idDesc,#idTitle,#idIntroLine1,#idIntroLine2,#idPath').on('keyup change', showCounter);
    
  $('#idType,#idParent').on('change',function(){
    console.log($('#idType').val(),$("#idParent").val());
    if ($('#idType').val()=='Page'){
      $("#idPath").attr('readonly', false);
    } else {
      $("#idPath").attr('readonly', true);
      getValue({'action':'isBook','id': $("#idParent").val()},function(data){
        if (data.status) {
          parentPath=data.data[0].path;
          $('#idFolder').trigger('change');
        }
      });
    }
  });
    
  $('#idFolder').on('change keyup',function(){
    let text = $('#idFolder').val().replace(/[ =_:]/g,'-').replace(/[^\u0621-\u064A0-9a-zA-Z-]/g,'');
    $('#idFolder').val(text);
    if ($('#idType').val()!='Page') $('#idPath').val( '/' + parentPath + text + '/').trigger('change');
  });
  
  var $wordcount = $('<small>').insertAfter($('#idText'));
  $('#idText').on('change keyup',function(){
    $wordcount.text(' Word count: ' + countWords(this.value) + ' | ');
  });
  
  function countWords(str) {
    return str.trim().split(/\s+/).length;
  }
  
	$modal.on('hide.bs.modal', function (event) {

	});
	

  var t = Array();
	
	$('#myTab a').on('click', function (e) {
		//e.preventDefault();
		var tabText = $(this).text();
		var id = $("#id").val();
		
		if (t[tabText]) t[tabText].clear(); //always clear table on tab
		if (id==0) {if (t[tabText]) t[tabText].draw(); return;} //if new, don't continue
		//if ($(this).data('id')==id) return; //if last used, don't get data again
		//$(this).data('id',$("#id").val()); //register last id used
		//$(this).tab('show'); //show tab
		switch(tabText){
      case "Text":
        
      break;
		}
		
	})
  
});

