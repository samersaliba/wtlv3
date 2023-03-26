$(function() {
	init(); //initialize page
	addModal('newspaper-o');
	$modal.find('.modal-footer')
		.append($('<button>',{type: 'button', id: 'addItem', title: 'Add item to PO. Press Save first!', 'class': 'btn btn-warning'}).append($('<i>').addClass('fa fa-plus')))
		.append($('<div>',{'class':'btn-group pull-left'})
			//.append($('<button>',{type: 'button', id: 'printPO', title: 'Print PO', 'class': 'btn btn-default'}).append($('<i>').addClass('fa fa-print')).append(''))
			//.append($('<button>',{type: 'button', id: 'savePO', title: 'Save PO', 'class': 'btn btn-default'}).append($('<i>').addClass('fa fa-file-excel-o')).append(''))
			//.append($('<button>',{type: 'button', id: 'pdfPO', title: 'Save PO as PDF', 'class': 'btn btn-default'}).append($('<i>').addClass('fa fa-file-pdf-o')).append(''))
			.append($('<button>',{type: 'button', id: 'printPOi', title: 'Print Item', 'class': 'btn btn-default'}).append($('<i>').addClass('fa fa-print')).append(' Print Item'))
		)
		
		/*
		.prepend($('<button>',{type: 'button', id: 'printPOi', title: 'Print Item', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-print')).append(' Print Item'))
		.prepend($('<button>',{type: 'button', id: 'pdfPO', title: 'Save PO as PDF', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-file-pdf-o')).append(''))
		.prepend($('<button>',{type: 'button', id: 'savePO', title: 'Save PO', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-file-excel-o')).append(''))
		.prepend($('<button>',{type: 'button', id: 'printPO', title: 'Print PO', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-print')).append(''))
		*/

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: function (d){
				return {action:'listPO',show: (typeof $('#showRange').data('show')=== 'undefined'?1000:0)};
			}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "Order Date", "data": 1, "width":"45px" },
            { "title": "Receive Date", "data": 2, "width":"70px", "sortable": false },
            { "title": "Item Type*", "data": 3 },
            { "title": "Used For*", "data": 4 },
			{ "title": "Job*", "data": 5,render: function (data, type, row, meta) {
				//if (data!=0) return 'N'+data; else return '';
				if (data!=0) return 'N'+data; else if (row[26]!="") return row[26]; else return '';
			} },
			{ "title": "Description*", "data": 6, "width":"350px"},
			{ "title": "Supplier*", "data": 24 },
			{ "title": "Qty", "data": 8 },
			{ "title": "Unit", "data": 9 },
			{ "title": "U. Price", "data": 10 , "width":"80px"},
			{ "title": "VAT", "data": 23 , "width":"50px"},
			{ "title": "PO#*", "data": 11, "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
					$(nTd).css('background-color', (sData%2?'#aaa':'#ddd')).css('font-weight', 'bold');
				 }
			},
			{ "title": "Ordered By", "data": 12 },
			{ "title": "Purchased By", "data": 14 },
			{ "title": "Requested By", "data": 16 },
			{ "title": "Invoice #*", "data": 18 },
			{ "title": "Invoice Date", "data": 19, "width":"45px" }
			
        ],		
		"order": [[ 12, "desc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [3,4,8]
            },
			{
				"searchable": false,
				"targets": [0,1,8,9,10,11,13,14,15,17]
			},
			{
				"orderable": false,
				"targets": [0,4,6,8,9,10,11,13,14,15,16,17]
			},
			{ "visible": false, "targets": [1,2,7,12,13,14,15,16,17,18] }
		],
		"drawCallback": function ( settings ) {
			var groupCol = 12;
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

			api.column(groupCol, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
					$(rows).eq( i ).before(
						$('<tr>')
						.append($('<td>',{'colspan':'100%','class':'group','style':'padding: 0 5px 0 5px'})
							.append($('<span>',{'class':'pull-left'})
								.append('<b>PO #' + group + '</b>'
								+ ' | <i class="fa fa-calendar-plus-o" title="Order date"></i> ' + api.column(1,{page:'current'}).data()[i]
								+ ' | <span' + (api.column(2,{page:'current'}).data()[i]?'':' class="text-danger"') + '><i class="fa fa-calendar-check-o" title="Recieve date"></i> ' + api.column(2,{page:'current'}).data()[i] + '</span>'
								+ ' | <span' + (api.column(17,{page:'current'}).data()[i]?'':' class="text-danger"') + '><i class="fa fa-file-text-o" title="Invoice #"></i> ' + api.column(17,{page:'current'}).data()[i]
								+ ' &equiv; ' + api.column(18,{page:'current'}).data()[i] + '</span>'
								+ ' | ' + api.column(7,{page:'current'}).data()[i]
								)
							)
							.append($('<div>',{'class':'btn-group pull-right'})
								.append($('<button>',{'title':'Print','class':'btn','style':'background-color:transparent','type':'button','data-id': group })
									.append($('<i>', {'class':'fa fa-print'}))
									.on('click',printPO)
								)
								.append($('<button>',{'title':'Save','class':'btn','style':'background-color:transparent','type':'button','data-id': group })
									.append($('<i>', {'class':'fa fa-file-excel-o'}))
									.on('click',printPO)
								)
								.append($('<button>',{'title':'PDF','class':'btn','style':'background-color:transparent','type':'button','data-id': group })
									.append($('<i>', {'class':'fa fa-file-pdf-o'}))
									.on('click',printPO)
								)
							)
						  
						)
					);
					last = group;
				}
			});
        } //"drawCallback"
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	
	
	//App buttons
	drawButtons();
   	$("div.newButton").append($('<button class="btn btn-app" id="showRange"><i class="fa fa-database" style="color:red"></i><span>Show All</span></button>').on('click',function(){
		if ($(this).data('show')=='All'){
			$(this).removeData('show');
			$(this).find('span').text('Show All');
			$(this).find('i').css('color','red');
		} else {
			$(this).data('show','All');
			$(this).find('span').text('Show Few');
			$(this).find('i').css('color','');
		}
		$table.ajax.reload();
	}));
	
	$("div.newButton")
		.append($('<span class="btn-group"></span>')
			.append($('<button class="btn-group btn-app dropdown-toggle" data-toggle="dropdown" aria-expanded="false">')
				.append($('<i id="filter" class="fa fa-filter"></i><span class="caret"></span>'))
			)
			.append($('<ul class="dropdown-menu" role="menu"></ul>')
				.append(fillFilter($table,'No Invoice'))
				.append(fillFilter($table,'Not Received'))
				.append($('<li class="divider">'))
				.append(fillFilter($table,'Cancel'))
			)
		);
	
	//App buttons ext
	function fillFilter($t,label){
		return $('<li>').append($('<a>' + label + '</a>')
			.css('cursor','pointer')
			.addClass(label=='Show Few'?'highlighted':'')
			.on('click',function(event){
				$(this).closest('ul').find('a').each(function(index){
					$(this).removeClass('highlighted');
				});
				$t.columns().search('');
				if (label=='Cancel'){
					$('#filter').css('color','');
				} else {
					$(this).addClass('highlighted');
					$('#filter').css('color','red');
					switch(label){
					case "No Invoice":
						$t.columns(17).search('^$',true,false);
					break;
					case "Not Received":
						$t.columns(2).search('^$', true, false);
					break;
					}
				}
				$t.draw(true);
			}))
	}
		
	
	//click view/new button
	$modal.on('show.bs.modal', function (event) {
		$('#myTab a:nth-child(1)').tab('show'); //Show first tab when opening modal
		var $e = $(event.relatedTarget); // Button that triggered the modal
		
		//$("#idCompanyIDtxt").text(''); //reset info elements
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 

			//Get latest PO number
			getValue({action:"getNewPOnumber"},function(data){
				if (data.status){ $("#idPOnumber").val(data.data[0].ponumber); } else { toastr["error"](data.msg); }
			});
			
			$("#idOrderDate").val(isoDate(new Date()));
			$("#idPOnumber").attr('readonly', false);
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idPOnumber").val(row[11]);
			$("#idOrderDate").val(row[1]);
			$("#idReceiveDate").val(row[2]);
			$("#idItemType").valTag(row[3]);
			$("#idUsedFor").val(row[4]);
			$("#idJob").val(row[5]);
			$("#idDesc").val(row[6]);
			$("#idQty").val(row[8]);
			$("#idUnit").val(row[9]);
			$("#idSupplier").val(row[7]);
			$("#idInvoiceNumber").val(row[18]);
			$("#idInvoiceDate").val(row[19]);
			$("#idOrderedBy").val(row[13]);
			$("#idPurchasedBy").val(row[15]);
			$("#idRequestedBy").val(row[17]);
			$("#idPriceUSD").val(row[20]);
			$("#idPriceLBP").val(row[21]);
			$("#idPriceEUR").val(row[22]);
			$("#idTVA").val(row[23]);
			$("#idMachine").val(row[26]);
			
			$("#idPOnumber").attr('readonly', true);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idOrderedBy, #idPurchasedBy, #idRequestedBy, #idUnit, #idSupplier, #idJob, #idMachine,#idItemType,#idPriceLBP').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idOrderedBy, #idPurchasedBy, #idRequestedBy, #idUnit, #idSupplier, #idJob, #idMachine,#idItemType').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editPO'}, close: false});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deletePO");
	
	//Active Form Updates on change
	$("#idSupplier").on('change',function(){
		
		if ($("#idSupplier").val()!='' && $("#idTVA").val()==''){
			getValue({action:"getCompTVA",id:$("#idSupplier").val()},function(data){
				$("#idTVA").val(data.data[0].tva);
			})
		}
	});
	
	//mask
	$('#idPriceLBP').maskx({maskx:'number'});
	
	//Add item
	$("#addItem").on('click',function(e){
		$("#id").val('');
		//$("#idPOnumber").val(row[11]);
		//$("#idOrderDate").val(row[1]);
		//$("#idReceiveDate").val(row[2]);
		$("#idItemType").val('').change();
		$("#idUsedFor").val('');
		//$("#idJob").val(row[5]);
		$("#idDesc").val('');
		$("#idQty").val('');
		$("#idUnit").val('').change();
		//$("#idSupplier").val(row[7]);
		//$("#idInvoiceNumber").val(row[18]);
		//$("#idInvoiceDate").val(row[19]);
		//$("#idOrderedBy").val(row[13]);
		//$("#idPurchasedBy").val(row[15]);
		//$("#idRequestedBy").val(row[17]);
		$("#idPriceUSD").val('');
		$("#idPriceLBP").val('');
		$("#idPriceEUR").val('');
		//$("#idTVA").val(row[23]);
	});	
	
	//Print
	//$('#printPO, #savePO, #pdfPO').on('click',function (){ print(this,{action: 'PO',id:$("#idPOnumber").val()}); });
	function printPO(){
		print(this,{action: 'PO',id:$(this).data('id')});
	}
	$('#printPOi').on('click',function (){ print(this,{action: 'POi',id:$("#id").val(),desc:$("#idDesc").val()}); });

	
});