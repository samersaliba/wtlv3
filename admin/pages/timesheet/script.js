$(function() {
	init(); //initialize page
	addModal('table');
	$modal.find('.modal-footer').append($('<button>',{type: 'button', id: 'addItem', title: 'Add to PO', 'class': 'btn btn-warning'}).append($('<i>').addClass('fa fa-plus')))
	
	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'listTS'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "Job Id", "data": 1,render: function ( data, type, row ) { return 'N'+data}},
			{ "title": "Date", "data": 2, "width": "75px" },
			{ "title": "Version", "data": 4},
			{ "title": "Section", "data": 3},
			{ "title": "Work", "data": 5},
			{ "title": "Worker", "data": 6},
			{ "title": "Supplier", "data": 7, "width": "150px"},
			{ "title": "Description", "data": 8, "width": "200px"},
			{ "title": "Unit", "data": 9},
			{ "title": "Qty", "data": 10},
			{ "title": "U. Price", "data": 14},
			{ "title": "Total", "data": 15}
        ],
		"order": [[ 1, "desc" ],[ 3, "desc" ],[ 4, "desc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [7]
            },
			{
				"searchable": false,
				"orderable": false,
				"targets": [0,2,5,6,7]
			},
			{ "visible": false, "targets": [1,2,3] }
		],
		"drawCallback": function ( settings ) {
			var groupCol = 1;
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
			var groupCol2 = 3;
			var last2=null;

			api.column(groupCol, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
					$(rows).eq( i ).before(
						$('<tr>')
						.append($('<td>',{'colspan':'100%','class':'group'})
							.append('<b>N' + group + '</b>'
							)
						)
					);
					last = group;
					last2 = null;
				}
				if ( last2 !== api.column(groupCol2,{page:'current'}).data()[i] ) {
					last2 = api.column(groupCol2,{page:'current'}).data()[i];
					$(rows).eq( i ).before(
						$('<tr>')
						.append($('<td>',{'colspan':'100%','class':'group2'})
							.append('<b>TS' + last2 + '</b>'
							+ ' | <i class="fa fa-calendar"></i> ' + api.column(2,{page:'current'}).data()[i]	
							)
						)
					);
				}
			});
        } //"drawCallback"
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
			
			$("#idJob").attr('readonly', false);
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idJob").val(row[1]);
			$("#idDate").val(row[2]);
			$("#idSection").val(row[3]);
			$("#idVersion").val(row[4]);
			$("#idWork").val(row[5]);
			$("#idWorker").val(row[17]);
			$("#idSupplier").val(row[18]);
			$("#idDesc").val(row[8]);
			$("#idQty").val(row[10]);
			$("#idUnit").val(row[9]);
			$("#idPriceUSD").val(row[11]);
			$("#idPriceLBP").val(row[12]);
			$("#idPriceEUR").val(row[13]);
			$("#idTVA").val(row[16]);
			
			$("#idJob").attr("readonly", "readonly") ;

			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idJob,#idWork,#idWorker,#idSupplier,#idUnit').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	
	//Select menu init
	$('#idJob,#idWork,#idWorker,#idSupplier,#idUnit').each(fillSelect);

	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editTS'}, close: false});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteTS");
	
	//Active Form Updates on change

	$("#addItem").on('click',function(e){
	
		$("#id").val('');
		//$("#idJob").val(row[1]);
		//$("#idDate").val(row[2]);
		//$("#idSection").val(row[3]);
		//$("#idVersion").val(row[4]);
		$("#idWork").val('');
		$("#idWorker").val('');
		$("#idSupplier").val('');
		$("#idDesc").val('');
		$("#idQty").val('');
		$("#idUnit").val('');
		$("#idPriceUSD").val('');
		$("#idPriceLBP").val('');
		$("#idPriceEUR").val('');
		$("#idTVA").val('');
		
		$('#idWork,#idWorker,#idSupplier,#idUnit').each(function(){ $(this).trigger('change'); }); //select2 elements
	});	
});

