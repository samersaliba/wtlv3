$(function() {
	init(); //initialize page
	addModal('wrench');
	$modal.find('.modal-footer').prepend($('<button>',{type: 'button', id: 'printStocki', title: 'Print Item', 'class': 'btn btn-default pull-left'}).append($('<i>').addClass('fa fa-print')).append(' Print Item'))
	//searchTitles = Array('Location','Code');
	
	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data: {action: 'stockList'}
		},
		columns: [
            { render: operateFormatter },
			{ "title": "Id","data": 0},
			{ "title": "<span style='writing-mode: vertical-rl;'>Needs<br>Checking</span>","data": 19,"searchable": false, "orderable": false, render: function ( data, type, row ) {
					var a,b;
					if (data==null) a= 360;
					else a= Math.round((new Date() - new Date(data))/(1000 * 60 * 60 * 24)/360*100);
					if (a>100) a=100;
					if (a>50) b='progress-bar-warning';
					if (a>70) b='progress-bar-danger';
					return '<div class="progress" ><div class="progress-bar ' + b	+ '" role="progressbar" aria-valuenow="' + a + '" aria-valuemin="0" aria-valuemax="100" style="width:' + a + '%"> ' + a + '% </div></div>';
				}
			},
			{ "title": "Type","data": 1, "width":"100px" },
            { "title": "Code","data": 2, "width":"70px" },
            { "title": "Description","data": 3, "width":"300px", "sortable": false,render: function ( data, type, row ) {
					if (row[23]=='Y') return '<del>' + data + '</del>'; else return data;
				}
			},
			{ "title": "Location","data": 11,  className: "bold" },
			{ "title": "PO Number","data": 4, "width":"70px" },
            { "title": "System","data": 5, "searchable": false  },
			{ "title": "Dext/W/Hex","data": 6, "searchable": false },
			{ "title": "Dint/th","data": 7, "searchable": false  },
			{ "title": "L/pc","data": 8, "searchable": false },
			{ "title": "Material","data": 9, "searchable": false },
			{ "title": "Shape","data": 10, "searchable": false , "width":"50px"},
			{ "title": "Qty","data": 12, "searchable": false },
			{ "title": "Unit","data": 13, "searchable": false },
			{ "title": "U Price","data": 17, "searchable": false },
			{ "title": "Stock","data": 18, "searchable": false },
			{ "title": "Deleted","data": 23, "searchable": false },
			{ "title": "Last Checked","data": 19, "searchable": false },
			{ "title": "Check Location","data": 20, "searchable": false, render: function ( data, type, row ) {
					if (data==row[11]) {return data} else {return '<span class="text-red">'+data+'</span>'}
				} 
			},
			{ "title": "Check Qty","data": 21, "searchable": false, render: function ( data, type, row ) {
					 if (parseFloat(data) == row[8]) return data; else return '<span class="text-red">'+data+'</span>';
				}
			},
			{ "title": "Check Unit","data": 27, "searchable": false, render: function ( data, type, row ) {
					 if (data == row[26]) return data; else return '<span class="text-red">'+data+'</span>';
				}
			},
			{ "title": '', render: function ( data, type, row ) {
					if ( parseFloat(row[21]) == row[8] && row[20] == row[11] && row[27] == row[26] ) return ''; else return '<i class="fa fa-times text-red"></i>';
					//if (row[20]==row[11]) return ''; else return '<i class="fa fa-times text-red"></i>';
					//if ( parseFloat(row[21]) == row[8]  ) return ''; else return '<i class="fa fa-times text-red"></i>';
				}
			},
			{ "title": "Days checked after change","data": 22, "searchable": false , render: function ( data, type, row ) {
					if (row[19]!=null) {
						var a = Math.ceil((new Date(row[19]) - new Date(data))/(1000 * 60 * 60 * 24));
						return a;
					}
					else return '';
					
				}
			},
			{ render: operateFormatter, "sortable": false },
        ],
		"order": [[ 1, "desc" ]],
		columnDefs: [

			{
				"orderable": false,
				"targets": [0,12,13]
			},
			{
                "targets": [ 1 ],
                "visible": false,
                "searchable": false
            }
		]
	});
	addTmain();
	$table=$(Tmain).DataTable(TmainOptions);
	
	//App buttons
	drawButtons();
	var order = $table.order(); //original order columns
	$("div.newButton")
		.append($('<span class="btn-group"></span>')
			.append($('<button class="btn-group btn-app dropdown-toggle" data-toggle="dropdown" aria-expanded="false">')
				.append($('<i id="order" class="fa fa-sort-amount-desc"></i><span class="caret"></span>'))
			)
			.append($('<ul class="dropdown-menu" role="menu"></ul>')
				.append(fillOrder($table,'Update Checked','list'))
				.append(fillOrder($table,'Needs Checking','percent'))
				.append(fillOrder($table,'Needs Update','times'))
				.append($('<li class="divider">'))
				.append(fillOrder($table,'Cancel'))
			)
		);
	
	//App buttons ext
	function fillOrder($t,label,icon){
		return $('<li>').append($('<a><i class="fa fa-' + icon + '"></i>' + label + '</a>')
			.css('cursor','pointer')
			.on('click',function(event){
				var $btnIconId = $(this).closest('span').find('i').first(); //$('#order');
				$(this).closest('ul').find('a').each(function(index){
					$(this).removeClass('highlighted');
				});
				$btnIconId.removeAttr('class');
				if (label=='Cancel'){
					$btnIconId.css('color','').addClass('fa fa-sort-amount-desc');
					$t.order(order);	
				} else {
					$(this).addClass('highlighted');
					$btnIconId.css('color','red').addClass('fa fa-' + icon);
					switch (label){
						case 'Update Checked':
						$t.order( [[ 24, 'desc' ],[18,'asc']] );
						break;
						case 'Needs Checking':
						$t.order( [[ 18,'asc' ],[2,'desc'],[6,'asc']] );
						break;
						case 'Needs Update':
						$t.order( [[ 18,'asc' ],[23,'desc'],[6,'asc']] );
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


		$("#idCodeText").text('');
		
		$("#idDescSys,#idPriceUSDSys,#idSystemSys,#idEntryDateSys,#idTypeSys,#idQtySys").text(''); 
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 

			$("#idLocation2").text('');
			$("#idQty2").text('');
			$("#idCode").attr('readonly', false);
			//$("#idDesc").attr('readonly', false);
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idType").val(row[1]);
			$("#idCode").val(row[2]);
			$("#idDesc").val(row[3]);
			$("#idPOnumber").val(row[4]);
			$("#idSystem").val(row[5]);
			$("#idDim1").val(row[6]);
			$("#idDim2").val(row[7]);
			$("#idDim3").val(row[8]);
			$("#idDimUnit").val(row[26]);
			$("#idMaterial").val(row[9]);
			$("#idShape").val(row[10]);
			$("#idLocation").val(row[11]);
			$("#idLocation2").text(row[20]);
			$("#idQty2").text(row[21]);
			$("#idQty").val(row[12]);
			$("#idMinQty").val(row[25]);
			$("#idUnit").val(row[13]);
			$("#idPriceUSD").val(row[14]);
			$("#idPriceLBP").val(row[15]);
			$("#idPriceEUR").val(row[16]);
			$("#idStock").val(row[18]);
			$("#idX").val(row[24]);
			
			$("#idCode").attr('readonly', true);
			//$("#idDesc").attr('readonly', true);
			
			function setClass(selector,cond){
				if (cond) $(selector).css('color', 'black'); else $(selector).css('color','red');
			}

			getValue({action:"listStockItemSys",id:row[2]},function(data){
				if (data.status){ 
					$("#idDescSys").text(data.data[0].desc); setClass("#idDescSys",data.data[0].desc==row[3]);
					$("#idPriceUSDSys").text(data.data[0].cost+' '+data.data[0].currency); setClass("#idPriceUSDSys",Number(data.data[0].cost)==row[14]);
					$("#idSystemSys").text('Y'); setClass("#idSystemSys",row[5]=='Y');
					$("#idEntryDateSys").text(data.data[0].entrydate); 
					$("#idTypeSys").text(data.data[0].type); setClass("#idTypeSys",data.data[0].type==row[1]);
					$("#idQtySys").text(data.data[0].qty); setClass("#idQtySys",Number(data.data[0].qty)==row[12]);
				} else { toastr["error"](data.msg); $("#idSystemSys").text('N');setClass("#idSystemSys",row[5]=='Y');}
			})
			
		}
		if ($e.is('.new,.open')) $('#idMaterial, #idShape, #idUnit, #idType,#idLocation, #idDimUnit, #idPriceLBP').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	$('#idMaterial, #idShape, #idUnit, #idType,#idLocation,#locations---, #idDimUnit').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveStock'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteStock");
	
	//Active Form Updates on change
	$('#idMaterial, #idShape, #idDim1, #idDim2, #idDim3').on('change',function (){
		if ($('#idMaterial').val()!='' && $('#idShape').val()!='' && $('#idDim1').val()!=0 && $('#idDim3').val()!=0){
			var a = $('#idDim1').val();
			var b = $('#idDim2').val();
			var c = $('#idDim3').val();
			var d = $('#idMaterial').data('vals')[$('#idMaterial').val()];
			var f = $('#idShape').data('vals')[$('#idShape').val()];
			$('#weight').text(' (calculated weight '+ eval(f).toFixed(1) + ' kg)');
		}
		else $('#weight').text('');
	});
		
	$("#idCode").on('keyup',function(){
		getValue({action:"getNewCode",id:$(this).val()},function(data){
			if (data.status){ $("#idCodeText").text('Next No.:'+data.data[0].code); } else { toastr["error"](data.msg); }
		})
	});	
	
	//mask
	$('#idPriceLBP').maskx({maskx:'number'});
	
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
	
	/*
	$('#idLocation').on('keyup change',function(){
		var that=this;
		getValue({action:"getLocationDesc",id:$(this).val()},function(data){
			//if (data.status){ $("#idLocationDesc").text(data.data[0].desc)} else $("#idLocationDesc").text('');
			if (data.status){ $(that).prop('title',data.data[0].desc)} else $(that).prop('title','1');
		})			
	});
	*/
		
	$('#printStocki').on('click',function (){ 
		print(this,{action:'Stocki',id:$("#id").val(),desc:$("#idCode").val()+ ':' + $("#idDesc").val()}); 
	});
	
	
		
	
	
	var t = Array();
	
	t['PO']=$('#po').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Order Date" },
			{ "title": "PO number" },
            { "title": "Used for" },
			{ "title": "Description" },
			{ "title": "Supplier" },
			{ "title": "Qty" },
			{ "title": "Price" ,"width":"75px"}
		]
	}));
	
	t['Change List']=$('#stockchange').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Date" },
			{ "title": "PO" },
			{ "title": "Desc Was", "width":"100px" },
			{ "title": "Desc Now", "width":"100px" },
			{ "title": "Qty" },
			{ "title": "Unit" },
			{ "title": "L1" },
			{ "title": "L2" },
			{ "title": "L used" },
			{ "title": "Used for" },
			{ "title": "Job #" },
			{ "title": "Used By" }
		],
		columnDefs: [
			{
				"searchable": false,
				"orderable": false,
				"targets": '_all'
			}]
	}));
	
	t['Check List']=$('#stockcheck').DataTable(
	$.extend(true,{},TtabOptions,{
		columns: [
			{ "title": "Date" },
			{ "title": "Location" },
			{ "title": "Desc" },
			{ "title": "Qty" },
			{ "title": "Unit" }
		],
		columnDefs: [
			{
				"searchable": false,
				"orderable": false,
				"targets": '_all'
			}]
	}));
		

	
	$('#myTab a').on('click', function (e) {
		var tabText = $(this).text();
		var id = $("#id").val();
		
		if (t[tabText]) t[tabText].clear(); //always clear table on tab
		if (id==0) {if (t[tabText]) t[tabText].draw(); return;} //if new, don't continue
		switch(tabText){
		case "Change List":	
			getValue({action: "stockchangeListtable2",id: $("#idCode").val()},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i].changedate,
								data.data[i].po,
								data.data[i].descwas,
								data.data[i].descnow,
								data.data[i].qty,
								data.data[i].unit,
								data.data[i].l1,
								data.data[i].l2,
								data.data[i].lused,
								data.data[i].usedfor,
								'N'+data.data[i].jobid,
								data.data[i].usedby
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		case "Check List":
			getValue({action: "stockCheckList",id: $("#idCode").val()},function(data){
				if (data.status){
					if (data.data){
						for (var i = 0;i < data.data.length;i++){
							t[tabText].row.add([
								data.data[i].timestamp,
								data.data[i].location,
								data.data[i].desc,
								data.data[i].qty,
								data.data[i].unit
							]);
						}
					}
				} else {
					toastr["error"](data.msg);
				}
				t[tabText].draw();
			})
		break;
		case "PO":	
			getValue({action: "showPOstock",id: $("#idCode").val()},function(data){
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
		}
	});
	
	
	
});
