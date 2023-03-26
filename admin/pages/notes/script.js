$(function() {
	init(); //initialize page
	addModal('envelope');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'notesList'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "ID", "data": "id"},
			{ "title": "From", "data": "owner"},
			{ "title": "To", "data": "user"},
			{ "title": "Note", "data": "desc",render: function ( data, type, row ){
				var temp='';
				if (row.read==1) temp = '<span class="label label-success pull-right">Read</span>';
				if (row.hide==1) temp += '<span class="label label-default pull-right">Hidden</span>';
				return  temp + data;
				}
			},
			{ "title": "Time", "data": "timestamp"},
        ],
		"order": [[ 1, "desc" ]]
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	
	//App buttons
	drawButtons();
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal
		
		var index = $e.data('index'); // Button that triggered the modal
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 
		} else if ($e.hasClass("open")) {
			var row = $table.row( index ).data();
			$("#id").val(row.id);
			$("#idNoteID").text(row.id);
			$("#idTo").val(row.userid);
			$("#idDesc").val(row.desc);
		}
		if ($e.is('.new,.open')) $('#idTo').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idTo').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveNote'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteNote");

});
