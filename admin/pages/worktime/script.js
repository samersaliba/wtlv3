$(function() {
	init(); //initialize page
	addModal('industry');
	$modal.find('.modal-footer').append($('<button>',{type: 'button', id: 'addItem', title: 'Add New', 'class': 'btn btn-warning'}).append($('<i>').addClass('fa fa-plus')))


	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'listWork'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "#"},
			{ "title": "Date", "data": 7, "width":"60px" },
            { "title": "Worker", "data": 8, "width":"70px", className: "bold", render: function ( data, type, row ) { 
				return '<button class="btn btn-default getWorker" data-search="' + data + ' ' + row[7] + '">'+data+ '/' + row[1]+'</button>'} 
			},
			{ "title": "Job", "data": 2, render: function ( data, type, row ) { return (data!=0?'N'+data:'')}},
			{ "title": "Work", "data": 3, "width":"70px", "searchable":true},
			{ "title": "Regular Hr. Worked", "data": 4 },
			{ "title": "Overtime Hr. Worked =", "data": 5 },
			{ "title": "<small>Equivalent to Hr.</small>", "data": 6},
			{ "title": "Note", "data": 9},
			
        ],
		"order": [[ 2, "desc" ]],
		columnDefs: [
			
			{
				"orderable": false,
				"targets": '_all' //[0,1,3,4,5,6,7,8,9]
			},
			{
				"searchable": false,
				"targets": [0,1,5,6,7,8]
			},
			{ "visible": false, "targets": [2] }
		],
		"pageLength": 100,
		"drawCallback": function ( settings ) {
			var groupCol = 2;
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
			var sum=[0,0,0];
			var rowNum = 1;

			function addsum(i){
				var a = '<tr class="bold"><td colspan="4"></td><td>Sum:</td>';
					sum.forEach( function(item, index){	a+= '<td class="lineabove">' + sum[index] + '</td>'});
					a +='<td></td></tr>';
				if (sum[0]>0) if (i==0) $(rows).last().after(a); else $(rows).eq(i).before(a);
			}
			api.column(groupCol, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
					
					addsum(i);
					$(rows).eq( i ).before(
						$('<tr>')
						.append($('<td>',{'colspan':'9','class':'group bold'})
							.append(formatDate(group))
						)
					);
					last = group;
					sum = [0,0,0];
					rowNum = 1;
					
				}
				api.column(1, {search:'applied', order:'applied', page:'current'} ).nodes()[i].innerHTML=rowNum++ + '.';
				sum.forEach( function(item, index){ 
					sum[index]+=parseFloat(api.column(index+6,{page:'current'}).data()[i])
				});
			});
			addsum(0);
			
			
			$('.getWorker').on('click',function(){
				$('#Tmain_filter>label>input[type=search]').val($(this).data('search'));
				$('#Tmain_filter>label>input[type=search]').trigger('keyup');
			})

        } //"drawCallback"
		
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	/*
	$table.on( 'order.dt search.dt', function (a,b) {
        $table.column(9, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1 +'.';
        } );
    } ).draw();
	*/
	
	//App buttons
	drawButtons();
	//$("div.newButton");
		
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal

		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 

		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idWorker").val(row[1]);
			$("#idJob").val(row[2]);
			$("#idWork").val(row[3]);
			$("#idDate").val(row[7]);
			$("#idHours").val(row[4]);
			$("#idHoursot").val(row[5]);
			$("#idHoursoti").val(row[6]);
			$("#idNote").valTag(row[9]);
		}
		
		//$('.tagged').append(this.cloneNode(true));
		
		if ($e.is('.new,.open')) $('#idWorker,#idJob,#idNote,#idWork').each(function(){ $(this).trigger('change'); }); //select2 elements
		
	})
	
	
	//Select menu init
	$('#idWorker,#idJob,#idNote,#idWork').each(fillSelect);

	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editWork'}, close: false});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteWork");
	
	//Active Form Updates on change
	$('#idHoursot').on('change',function (){
		$('#idHoursoti').val($('#idHoursot').val()*1.5);
	});
	
	//Add item
	$("#addItem").on('click',function(e){
		$("#id").val('');
		//$("#idWorker").val('');
		$("#idJob").val(0).change();
		$("#idWork").val('').change();
		//$("#idDate").val('');
		$("#idHours").val('');
		$("#idHoursot").val(0);
		$("#idHoursoti").val(0);
		$("#idNote").val('').change();
	});	
	
		
	//Print
	//$('#printStockChange').on('click',function (){ print(this,{action:'StockChange',id:$("#id").val(),desc:$("#idDescNow").val()})});
	

	
});


