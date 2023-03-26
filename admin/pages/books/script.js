$(function() {
	init(); //initialize page
	addModal('book');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listBooks'}
		},
        columns: [
      { render: operateFormatter },
			{ "title":"Title", "data": 1 }, 
			{ "title":"Description", "data": 2 },
      { "title":"Writer", "data": 8 },
      { "title":"File", "data": 7 },
      { "title":"Article", "data": 9 },
			{ "title":"Deleted", "data": 6 }
        ],
		"order": [[ 1, "asc" ]],
		columnDefs: [
			{
				render: overflowHandle,
        targets: [2]
      },
			{
				"searchable": false,
				"orderable": false,
				"targets": 0
			}
		]
    });
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	
	//App buttons
	drawButtons();
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal

		//$("#idCompanyIDtxt").text(''); //reset info elements
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idTitle").val(row[1]);
			$("#idDesc").val(row[2]);
      $("#idWriter").val(row[3]);
      $("#idFile").val(row[4]);
      $("#idArticle").val(row[5]);
			$("#idDeleted").val(row[6]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idWriter,#idFile,#idArticle').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idWriter,#idFile,#idArticle').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editBooks'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteBooks");

});

