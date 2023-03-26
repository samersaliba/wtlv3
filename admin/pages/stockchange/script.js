$(function() {
	init(); //initialize page
	addModal('exchange');
	$modal.find('.modal-footer').prepend($('<button>',{type: 'button', id: 'printStockChange', title: 'Print Stock Change', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-print')).append(' Print Stock Change'))

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'stockchangeList'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "Change Date", "data": 1, "width":"45px" },
			{ "title": "Voucher No.", "data": 14 },
            { "title": "Code", "data": 2, "width":"50px", className: "bold" },
			{ "title": "Description was", "data": 3, "width":"300px",render: function ( data, type, row ) {
			if (row[16]=='Y') return '<del>' + data + '</del>'; else return data;}},
			{ "title": "Description now", "data": 4, "width":"300px",render: function ( data, type, row ) {
			if (row[16]=='Y') return '<del>' + data + '</del>'; else return data;}},
			{ "title": "Qty", "data": 5, "searchable": false },
			{ "title": "Unit", "data": 6, "searchable": false },
			{ "title": "L was", "data": 7, "searchable": false , "width":"40px"},
			{ "title": "L now", "data": 8, "searchable": false, "width":"40px"},
			{ "title": "L used", "data": 9, "searchable": false, "width":"40px" },
			{ "title": "Used for", "data": 10,  "width":"150px" },
			{ "title": "PO", "data": 17},
			{ "title": "Machine", "data": 15 },
			{ "title": "Job ID", "data": 13,render: function (data, type, full, meta) { if (data!=0) return 'N' + data; else return ''} },
			{ "title": "Used By", "data": 11 }
			
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
	//$("div.newButton");
		
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal
		
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 

			$("#idChangeDate").val(isoDate(new Date()));
			$("#idCode").attr('readonly', false);
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idChangeDate").val(row[1]);
			$("#idCode").val(row[2]);
			$("#idDescWas").val(row[3]);
			$("#idDescNow").val(row[4]);
			$("#idQty").val(row[5]);
			$("#idUnit").val(row[6]);
			$("#idL1").val(row[7]);
			$("#idL2").val(row[8]);
			$("#idLused").val(row[9]);
			$("#idUsedFor").valTag(row[10]);
			$("#idPOnumber").val(row[17]);
			$("#idUsedBy").val(row[12]);
			$("#idJob").val(row[13]); 
			$("#idVoucher").val(row[14]);
			$("#idMachine").val(row[15]);
			
			$("#idCode").attr('readonly', true);
		
		}
		if ($e.is('.new,.open')) $('#idUsedBy, #idUnit, #idJob,#idCode,#idMachine,#idUsedFor').each(function(){ $(this).trigger('change'); }); //select2 elements
		$('#weight').text('');
	})
	
	
	//Select menu init
	$('#idUsedBy, #idUnit, #idJob,#idMachine,#idUsedFor').each(fillSelect);

	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveStockChange'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteStockChange");
	
	//Active Form Updates on change
	$('#idCode').on('keyup',function (){
		if ($(this).val()!='') 
		getValue({action:"getStockName",code:$(this).val()},function(data){
			if (data.status){
				if (data.data){
					$('#idDescWas').val(data.data[0].text); 
					$('#idMaterial').val(data.data[0].material); 
					$('#idMaterial').data('density',data.data[0].density);
					$('#idMaterial').data('formula',data.data[0].formula);
					$('#idMaterial').data('dim1',data.data[0].dim1);
					$('#idMaterial').data('dim2',data.data[0].dim2);
					$('#idUnit').val(data.data[0].unit).trigger('change'); 
					$('.dimunit').text(data.data[0].dimunit); 
				
					$('#idL1').trigger('change');
					$('#idCode').removeClass('text-red');
					$('.modal-footer>button[type="submit"]').prop( "disabled", false );
				} else { 
					$('#idDescWas').val(''); 
					$('#idUnit').val('').trigger('change'); 
					$('.dimunit').text(''); 
					
					$('#idCode').addClass('text-red'); 
					$('.modal-footer>button[type="submit"]').prop( "disabled", true );
				}
			} else { toastr["error"](data.msg); }
		})
	});
	$modal.on('hide.bs.modal', function (event) {
		$('#idCode').removeClass('text-red');
	})
	
	$('#idL1,#idL2,#idMaterial').on('change',function (){
		$('#idLused').val(($('#idL1').val()-$('#idL2').val()).toFixed(2));
		var a = $('#idMaterial').data('dim1');
		var b = $('#idMaterial').data('dim2');
		var c = $('#idLused').val();
		var d = $('#idMaterial').data('density');
		var f = $('#idMaterial').data('formula');
		
		if (f) $('#weight').text(eval(f).toFixed(1)+"kg"); else $('#weight').text('');

	});
	
	$('#idUsedFor').on('change',function(){
		//$('#idPOnumber').attr('readonly', $('#idUsedFor').val()!="Added");
		$('#idPOnumber').attr('readonly', $('#idUsedFor')[0].selectedIndex!=1);
	});
	
		
	//Print
	$('#printStockChange').on('click',function (){ print(this,{action:'StockChange',id:$("#id").val(),desc:$("#idDescNow").val()})});
	
});


