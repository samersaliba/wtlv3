$(function() {
	init(); //initialize page
	addModal('folder-o');
	$modal.find('.modal-footer')
		.append($('<div>',{'class':'btn-group pull-left'})
			.append($('<button>',{type: 'button', id: 'printJOBi', title: 'Print Job', 'class': 'btn btn-default'}).append($('<i>').addClass('fa fa-print')).append(' Print Job'))
			.append('<input type="text" id="printText" style="margin:5px 0 0 5px" placeholder="Text to print" size="50" maxlength="100">')
		)
	
	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'jobsList'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "Request Date", "data": 8, "searchable": false },
			{ "title": "Job Id", "data": 0,render: function ( data, type, row ) { return 'N'+data}},
            { "title": "Their No.", "data": 2,"width":"30px"},
            { "title": "Description", "data": 3, "width":"300px", "sortable": false,
				render: function ( data, type, row ) {
					var temp='';
					if (row[16]=='Cancelled') temp+='<i class="fa fa-close"></i> ';
					if (row[18]=='Finished') {
						if (row[16]=='Approved') temp+='<i class="fa fa-check"></i> ';
						temp+= '<span class="label label-default pull-right">Finished</span>';
					}
					if (row[16]=='Approved') temp+=  '<span class="label label-success pull-right">Approved</span>';
					
					return temp+data;
				}
			},
			{ "title": "Client", "data": 5, "width":"70px" },
            { "title": "Service Supplier", "data": 28, "searchable": false  },
			{ "title": "Offer Date", "data": 9, "searchable": false  },
			{ "title": "Offer Value", "data": 12, "searchable": true  },
			{ "title": "Offer Status", "data": 16, "searchable": true , "width":"50px", 
				 render: function ( data, type, row ) {
					var b= {'Pricing':'info','Cancelled':'default','Approved':'success','Rejected':'danger','Pending':'warning','Time Sheet':'primary'}
					if (data!='') return  '<span class="label label-' + b[data] + '">' + data + '</span>'; else return data;
				} 
			},
			{ "title": "Work Status", "data": 18, "searchable": true , "width":"50px",
				render: function ( data, type, row ) {
					var b= {'Finished':'default','Not started':'danger','Paused':'warning','Rejected':'danger','In progress':'success'}
					if (data!='') return  '<span class="label label-' + b[data] + '">' + data + '</span>'; else return data;
				} 
			},
			{ "title": "V#", "data": 13, "searchable": false  },
			{ "title": "Estimated Delivery", "data": 14, "searchable": false },
			{ "title": "Approval Date", "data": 17, "searchable": false , "width":"50px"},
			{ "title": "Delivery Date", "data": 23, "searchable": false , "width":"50px"},
			{ "title": "System Number", "data": 1,"width":"40px"},
			{ "title": "Invoice Value", "data": 24, "searchable": false , "width":"50px"},
			{ "title": "Invoice Date", "data": 25, "searchable": false , "width":"50px"},
			{ "title": "Note", "data": 26, "width":"200px"}
        ],
		"order": [[ 1, "desc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [5,6,18]
            },
			{
				"searchable": false,
				"orderable": false,
				"targets": 0
			},
			{
				"visible": false,
				"targets": [19,20,21,22]
			}
		]
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);

	//App buttons
	drawButtons();
	$("div.newButton")
		.append($('<span class="btn-group"></span>')
			.append($('<button class="btn-group btn-app dropdown-toggle" data-toggle="dropdown" aria-expanded="false">')
				.append($('<i id="filter" class="fa fa-filter"></i><span class="caret"></span>'))
			)
			.append($('<ul class="dropdown-menu" role="menu"></ul>')
				.append(fillFilter($table,'Approved'))
				.append(fillFilter($table,'Pending'))
				.append(fillFilter($table,'Pricing'))
				.append(fillFilter($table,'Time Sheet'))
				.append(fillFilter($table,'Hide Finished'))
				.append(fillFilter($table,'No Offer Value'))
				.append($('<li class="divider">'))
				.append(fillFilter($table,'Cancel'))
			)
		);
	
	//App buttons ext
	function fillFilter($t,label){
		return $('<li>').append($('<a>' + label + '</a>')
			.css('cursor','pointer')
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
					switch (label){
						case 'Hide Finished':
						$t.columns(9).search('^((?!(Cancelled|Rejected)).)*$',true);
						$t.columns(10).search('^((?!(Finished)).)*$',true);
						break;
						case 'Approved':
						$t.columns(9).search(label,false);
						$t.columns(10).search('^((?!Finished).)*$',true);
						break;
						case 'Pending':
						$t.columns(9).search(label,false);
						break;
						case 'No Offer Value':
						$t.columns(8).search('^(0)$',true);
						break;
						default:
						$t.columns(9).search(label,false); 
						break;
					}
					/*
					if (label!='Hide Finished') $t.columns(9).search(label,false); 
					else {
						$t.columns(9).search('^((?!(Cancelled|Rejected)).)*$',true);
						$t.columns(10).search('^((?!(Finished)).)*$',true);
					}
					if (label=='Approved') $t.columns(10).search('^((?!Finished).)*$',true);
					*/
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
			
			//Get latest job number
			getValue({action:"getNewJobNumber"},function(data){
				if (data.status){ $("#idJobID").text(data.data[0].jobnumber); } else { toastr["error"](data.msg); }
			})
			$("#file").val('');
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idJobID").text(row[0]);
			$("#idNumber").val(row[1]);
			$("#idTheirNo").val(row[2]);
			$("#idDesc").val(row[3]);
			$("#idClient").val(row[4]);
			$("#idContact").val(row[6]);
			$("#idRequestDate").val(row[8]);
			$("#idOfferDate").val(row[9]);
			$("#idOfferValueUSD").val(row[10]);
			$("#idOfferValueLBP").val(row[11]);
			$("#idVersion").val(row[13]);
			$("#idEstimatedDelivery").val(row[14]);
			$("#idEstDelDays").val(row[15]);
			$("#idOfferStatus").val(row[16]);
			$("#idApprovalDate").val(row[17]);
			$("#idWorkStatus").val(row[18]);
			$("#idActionRequired").val(row[19]);
			$("#idOrderStart").val(row[20]);
			$("#idOrderFinish").val(row[30]);
			$("#idCurrentWorker").val(row[21]);
			$("#idDeliveryDate").val(row[23]);
			$("#idInvoiceValueUSD").val(row[24]);
			$("#idInvoiceValueLBP").val(row[31]);
			$("#idInvoiceDate").val(row[25]);
			$("#idNote").val(row[26]);
			$("#idServicesupplier").val(row[27]);
			$("#idDelOrdNum").val(row[29]);
			
			$("#printText").val(row[3]);
			$("#file").val('');
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idClient,#idContact,#idCurrentWorker,#idServicesupplier,#idOfferValueUSD,#idOfferValueLBP,#idInvoiceValueUSD,#idInvoiceValueLBP').each(function(){ $(this).trigger('change'); }); //select2/mask elements
	})
	
	
	//Select menu init
	$('#idClient,#idContact,#idCurrentWorker,#idServicesupplier').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveJob'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteJob");
	
	//Active Form Updates on change
	$('#idEstDelDays,#idApprovalDate').on('change',function(){
		var ed = $('#idEstDelDays').val();
		var ad = $('#idApprovalDate').val();
		if (ed!='' && ad!='') $('#idEstimatedDelivery').val(isoDate(addWeekDays(ad,ed)));
	})	
	$('#idApprovalDate').on('change',function(){
		$('#idOfferStatus').val('Approved');
		toastr["success"]('Offer is <b>Approved</b>');
	})
	$('#idDeliveryDate,#idOrderFinish').on('change',function(){
		$('#idWorkStatus').val('Finished');
		toastr["success"]('Work is <b>Finished</b>');
	})
	$('#idOfferDate').on('change',function(){
		$('#idOfferStatus').val('Pending');
		toastr["warning"]('Offer is <b>Pending</b>');
	})
	$('#idInvoiceValueLBP').on('change',function(){
		var USD = parseInt($('#idInvoiceValueLBP').val().replace(/,/g,'')) / 1507.5;
		if ($('#idInvoiceValueUSD').val()==0)
			$('#idInvoiceValueUSD').val(USD.toFixed(2));
	})
	
	
	
	$modal.on('hide.bs.modal', function (event) {
		var $files = $("#files");
		$files.removeData('selected');
	});
	
	//mask
	$('#idOfferValueUSD').maskx({maskx:'money'});
	$('#idOfferValueLBP').maskx({maskx:'number'});
	$('#idInvoiceValueUSD').maskx({maskx:'money'});
	$('#idInvoiceValueLBP').maskx({maskx:'number'});
	

	var t = Array();
	t['files']=$('#files');
	
	t['PO']=$('#po').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Order Date" },
			{ "title": "PO number" },
            { "title": "Used for" },
			{ "title": "Description" },
			{ "title": "Supplier" },
			{ "title": "Qty" },
			{ "title": "U.Price" ,"width":"75px"}
		]
	}));
	
	t['Stock']=$('#stock').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Date" },
			{ "title": "Code" },
            { "title": "Desc was" },
			{ "title": "Desc now" },
			{ "title": "Change" },
			{ "title": "U Price" },
			{ "title": "L was" },
			{ "title": "L now" },
			{ "title": "L used" },
			{ "title": "Used for" }
		]
	}));
	
	t['Work']=$('#work').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Date" },
			{ "title": "Worker" },
			{ "title": "Work" },
			{ "title": "Hours" },
			{ "title": "Overtime Hr." },
			{ "title": "Regular Hr." },
			{ "title": "Note" }
		],
		"drawCallback": function ( settings ) {
			
			var groupCol = 3;
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
			var sum=[0,0,0];

			function addsum(i){
				var a = '<tr class="bold"><td colspan="2"></td><td>Sum:</td>';
					sum.forEach( function(item, index){	a+= '<td class="lineabove">' + sum[index] + '</td>'});
					a +='<td></td></tr>';
				if (sum[0]>0) if (i==0) $(rows).last().after(a); else $(rows).eq(i).before(a);
			}
			api.column(groupCol, {page:'current'} ).data().each( function ( group, i ) {
 				sum.forEach( function(item, index){ 
					sum[index]+=parseFloat(api.column(index+groupCol,{page:'current'}).data()[i])
				});
			});
			addsum(0);
			
			
        } //"drawCallback"
	}));
	
	t['Timesheet']=$('#timesheet').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "id" },
            { "title": "Sheet" },
			{ "title": "V#" },
			{ "title": "Work" },
			{ "title": "Worker" },
			{ "title": "Supplier", "width": "100px"},
			{ "title": "Description", "width": "200px"},
			{ "title": "Qty" },
			{ "title": "U. Price" },
			{ "title": "Total" },
			{ "title": "Date"}
		],
		columnDefs: [
			{
				"searchable": false,
				"orderable": false,
				"targets": '_all'
			},
			{ "visible": false, "targets": [0,1,2,10] }
			],
		"drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
			var section=null;
			var sum=0;
			var lastsection=null;
			
			function addsum(i){
				var a = '<tr class="bold"><td colspan="5"></td><td>Sum:</td><td class="lineabove">' + sum + '</td></tr>';
				if (sum>0) if (i==0) $(rows).last().after(a); else $(rows).eq(i).before(a);
			}
	
            api.column(2, {page:'current'} ).data().each( function ( group, i ) {
				section=api.column(1, {page:'current'} ).data()[i];
                if ( last !== group ) {
                    addsum(i);
					$(rows).eq( i ).before(
						$('<tr>')
						.append($('<td>',{'class':'group','colspan':'100%','style':'padding: 0 5px 0 5px'})
							.append('<span class="pull-left">Timesheet: TS' + group + ' (' + api.column(10).data()[i] + ')</span>')
							.append($('<div>',{'class':'btn-group pull-right'})
								.append($('<button>',{'title':'Print','class':'btn','style':'background-color:transparent','type':'button','data-id': api.column(0).data()[i],'data-ver': group })
									.append($('<i>', {'class':'fa fa-print'}))
									.on('click',printSaveTS)
								)
								.append($('<button>',{'title':'Save','class':'btn','style':'background-color:transparent','type':'button','data-id': api.column(0).data()[i],'data-ver': group })
									.append($('<i>', {'class':'fa fa-file-excel-o'}))
									.on('click',printSaveTS)
								)
								.append($('<button>',{'title':'PDF','class':'btn','style':'background-color:transparent','type':'button','data-id': api.column(0).data()[i],'data-ver': group })
									.append($('<i>', {'class':'fa fa-file-pdf-o'}))
									.on('click',printSaveTS)
								)
							)
						)
					);
                    last = group;
					sum = 0;
					lastsection = null;
                }
				if (lastsection !== section){
					addsum(i);
					$(rows).eq( i ).before('<tr class="bold"><td colspan="8">'+section +'</td></tr>');
					lastsection=section;
					sum=0;
				}
				sum+=parseFloat(api.column(9).data()[i]);
            } );
			addsum(0);
        }
	}));
	
	

	function printSaveTS(){
		print(this,{action: 'TS',id:$(this).data('id'),jid:$("#id").val(),ver:$(this).data('ver')});
	}
	$('#printJOBi').on('click',function (){ print(this,{action: 'JOBi',id:$("#id").val(),desc:$("#idDesc").val(),printtext:$("#printText").val()}); });
	
	
	//Upload
	$folder = $('#folder').upload();
	
	$('#myTab a').on('click', function (e) {
		//e.preventDefault();
		var tabText = $(this).text();
		var id = $("#id").val();
		
		if (t[tabText]) t[tabText].clear(); //always clear table on tab
		if (id==0) {if (t[tabText]) t[tabText].draw(); return;} //if new, don't continue
		//if ($(this).data('id')==id) return; //if last used, don't get data again
		//$(this).data('id',$("#id").val()); //register last id used
		//$(this).tab('show'); //show tab
		switch(tabText){
		case "Files":
			$folder.upload({folderID: $("#idJobID").text()});
			$folder.upload('showFiles');
		break;
		case "PO":	
			getValue({action: "showPO",id: id},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i].orderdate,
								data.data[i].ponumber,
								data.data[i].usedfor,
								data.data[i].desc,
								data.data[i].supplier,
								data.data[i].qty + ' ' + data.data[i].unit,
								data.data[i].uprice
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		case "Stock":
			getValue({action: "showSC",jid: id},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i]['changedate'],
								data.data[i]['code'],
								data.data[i]['descwas'],
								data.data[i]['descnow'],
								data.data[i]['qty'] + ' ' + data.data[i]['unit'],
								data.data[i]['price'],
								data.data[i]['l1'],
								data.data[i]['l2'],
								data.data[i]['lused'],
								data.data[i]['usedfor']
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		case "Work":	
			getValue({action: "showWork",jid: id},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i][7],
								data.data[i][8]+'/'+data.data[i][1],
								data.data[i][3],
								data.data[i][4],
								data.data[i][5],
								data.data[i][6],
								data.data[i][9]
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		case "Timesheet":	
			getValue({action: "showTS",jid: id},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i][0],
								data.data[i][3],
								data.data[i][4],
								data.data[i][5],
								data.data[i][6],
								data.data[i][7],
								data.data[i][8],
								data.data[i][10]+ ' ' + data.data[i][9],
								data.data[i][14],
								data.data[i][15],
								data.data[i][2]
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		}
		
	})
});

