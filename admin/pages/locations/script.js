$(function() {
	init(); //initialize page
	addModal('map-pin');
	

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listLocations'}
		},
        columns: [
            { render: operateFormatter },
			{ "title":"Code", "data": 1 , "width": "75px"}, 
			{ "title":"Desc", "data": 2 },
			{ "title":"Coordinates", "data": 3}
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
			$("#idCode").val(row[1]);
			$("#idDesc").val(row[2]);
			$("#idX").val(row[3]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		//if ($e.is('.new,.open')) $('#idWorker,#idJob').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	//$('#idWorker,#idJob').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editLocations'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteLocations");
	
	//Get coordinates from mouse
	var canvas=$('#lightbox').find('.lb-image')[0];
	$('#lightbox').find('.lb-container').on('click',mouseClicked)
	function mouseClicked (mouse) {
		//var rect = canvas.getBoundingClientRect();
		//console.log("mouse clicked",mouse.offsetX,mouse.offsetY);
		var xscale=canvas.offsetWidth/canvas.naturalWidth;
		var yscale=canvas.offsetHeight/canvas.naturalHeight;
		var mouseXPos = Math.round(mouse.offsetX/xscale);
		var mouseYPos = Math.round(mouse.offsetY/yscale);
		$("#idX").val(mouseXPos + ',' + mouseYPos);
		movePointer($("#idX").val());
	}


});

