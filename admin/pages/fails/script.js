$(function() {
	init(); //initialize page
	addModal('thumbs-down');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listFails'}
		},
        columns: [
            { render: operateFormatter },
			{ "title":"Date", "data": 1 , "width": "75px"}, 
			{ "title":"Worker", "data": 2 },
			{ "title":"Job", "data": 3,render: function ( data, type, row ) { return 'N'+data} },
			{ "title":"Note", "data": 4 , "width": "300px",render: function ( data, type, row ) { return data.substr(0,100)+'...'}},
        ],
		"order": [[ 1, "desc" ]],
		columnDefs: [
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
			$("#idDate").val(row[1]);
			$("#idWorker").val(row[5]);
			$("#idJob").val(row[3]);
			$("#idNote").val(row[4]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idWorker,#idJob').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idWorker,#idJob').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editFails'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteFails");

});

