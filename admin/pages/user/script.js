$(function() {
	init(); //initialize page
	addModal('users');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listUsers'}
		},
        columns: [
            { render: operateFormatter },
			{ "title":"Full Name", "data": 1 }, 
			{ "title":"Nickname", "data": 2 },
			{ "title":"Number", "data": 3 },
			{ "title":"Username", "data": 4 },
			{ "title":"Password", "data": 5 },
			{ "title":"Position", "data": 6 },
			{ "title":"E-mail", "data": 7 },
			{ "title":"Image", "data": 8 },
			{ "title":"Deleted", "data": 9 }
        ],
		"order": [[ 9, "asc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [8,9]
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
			$("#idFullName").val(row[1]);
			$("#idNickname").val(row[2]);
			$("#idNumber").val(row[3]);
			$("#idUsername").val(row[4]);
			$("#idPassword").val(row[5]);
			$("#idPosition").val(row[6]);
			$("#idEmail").val(row[7]);
			$("#idImage").val(row[8]);
			$("#idDeleted").val(row[9]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		//if ($e.is('.new,.open')) $('#idCompanyID').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	//$('#idCompanyID').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editUsers'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteUsers");

});

