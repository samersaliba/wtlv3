$(function() {
	init(); //initialize page
	addModal('television');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'tvList'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "ID", "data": 0},
			{ "title": "Message", "data": 1},
			{ "title": "Hidden", "data": 2},
			{ "title": "Order", "data": 3},
        ],
		"order": [[ 4, "asc" ]]
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	
	//App buttons
	drawButtons();
	//$("div.newButton")
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal
		
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 


		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idMsgID").text(row[0]);
			$("#idHide").val(row[2]);
			$("#idMsg").val(row[1]);
			$("#idOrder").val(row[3]);
		}
	})
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveTV'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteTV");


});
