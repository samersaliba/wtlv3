$(function() {
	init(); //initialize page
	addModal('clock-o');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'listReminders'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "ID", "data": 0},
			{ "title": "Machine", "data": 1},
			{ "title": "Title", "data": 2},
			{ "title": "Text", "data": 3},
			{ "title": "Interval", "data": 4},
			{ "title": "Timestamp", "data": 5}
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
			$("#id").val(row[0]);
			$("#idID").text(row[0]);
			$("#idMachine").val(row[1]);
			$("#idTitle").val(row[2]);
			$("#idText").val(row[3]);
			$("#idInterval").val(row[4]);
		}
		if ($e.is('.new,.open')) $('#idMachine').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idMachine').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editReminders'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteReminder");
	
	var t=Array();
	
	t['LOG']=$('#log').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Date" },
			{ "title": "User" }
		]
	}));
	
	$('#myTab a').on('click', function (e) {
		e.preventDefault();
		$(this).tab('show');
		if ($("#id").val()==0) return;
		if ($(this).data('code')==$("#id").val()) return;
		$(this).data('code',$("#id").val());
		var tabText = $(this).text();
		switch(tabText){
		case "LOG":	
			t[tabText].clear().draw();
			getValue({action: "showReminderLOG",id: $("#id").val()},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i].timestamp,
								data.data[i].user
							]);
						}
						t[tabText].draw();
					}
				} else {
					toastr["error"](data.msg);
				}
			})
		break;

		}
	})

});
