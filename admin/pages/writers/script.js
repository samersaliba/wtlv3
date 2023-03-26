$(function() {
	init(); //initialize page
	addModal('edit');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listWriters'}
		},
        columns: [
            { render: operateFormatter },
			{ "title":"Name", "data": 1 }, 
			{ "title":"Picture", "data": 4 },
      { "title":"URL", "data": 5 },
			{ "title":"Deleted", "data": 3 }
        ],
		"order": [[ 1, "asc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [1]
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
			$("#idName").val(row[1]);
			$("#idPicture").val(row[2]);
			$("#idDeleted").val(row[3]);
      $("#idURL").val(row[5]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idPicture').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idPicture').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editWriters'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteWriters");

});

