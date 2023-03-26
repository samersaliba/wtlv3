$(function() {
	init(); //initialize page
	addModal('users');

	//Tmain table init
	$.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listContacts'}
		},
        columns: [
            { render: operateFormatter },
			{ "title":"Company", "data": 1 }, //"data":1
			{ "title":"Name", "data": 2, "width": "250px" },
			{ "title":"Short Name", "data": 17 },
			{ "title":"Phone 1", "data": 3 },
			{ "title":"Phone 2", "data": 4 },
			{ "title":"Fax", "data": 5, "width": "50px" },
			{ "title":"Cell", "data": 6, "width": "50px" },
			{ "title":"E-mail", "data": 7 },
			{ "title":"Address", "data": 8 },
			{ "title":"Description", "data": 9 },
			{ "title":"Web", "data": 10 },
			{ "title":"TVA", "data": 11 },
			{ "title":"A company?", "data": 12 },
			{ "title":"Is supplier?", "data": 13 },
			{ "title":"Is client", "data": 14 },
			{ "title":"Service Supplier?", "data": 15 }
        ],
		"order": [[ 2, "asc" ]],
		columnDefs: [
			{
				render: overflowHandle,
                targets: [1,8,9]
            },
			{
				render: function ( data, type, row ) { return (data==1?'&check;':'')},
				targets: [13,14,15,16]
			},
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

		$("#idCompanyIDtxt").text(''); //reset info elements
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idCompanyID").val(row[16]);
			$("#idName").val(row[2]);
			$("#idShortName").val(row[17]);
			$("#idPhone1").val(row[3]);
			$("#idPhone2").val(row[4]);
			$("#idFax").val(row[5]);
			$("#idCell").val(row[6]);
			$("#idEmail").val(row[7]);
			$("#idAddress").val(row[8]);
			$("#idDescription").val(row[9]);
			$("#idWeb").val(row[10]);
			$("#idTVA").val(row[11]);
			$("#idiscompany").val(row[12]);
			$("#idissupplier").val(row[13]);
			$("#idisclient").val(row[14]);
			$("#idisservicesupplier").val(row[15]);
			
			if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		if ($e.is('.new,.open')) $('#idCompanyID,#idPhone1,#idPhone2,#idFax,#idCell').trigger('change'); //select2/mask elements
	})
	
	//Select menu init
	$('#idCompanyID').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'saveContact'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteContact");
	
	//Active Form Updates on change
	
	//mask
	$('#idPhone1,#idPhone2,#idFax,#idCell').maskx({maskx:'phone'});

});

