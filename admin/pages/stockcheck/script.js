$(function() {
	init(); //initialize page

	//data: dataSet,
    var $table=$('#stock').DataTable( {
        "ajax": {
			url:"/admin/script/",
			data: {action:'stockCheckList'},
			//dataSrc: 'data',
			dataSrc: function(json){
				toastr["info"]("Data loaded");
				return json.data;
			},
			"type": "POST",
			error: function (xhr, error, code){ 
				toastr["error"](xhr.status + ' - ' + xhr.statusText);
			}
		},
		
		"deferRender": false,
		"responsive": true,
		"scrollX": true,
		"pageLength": 20,
		//stateSave: true, //save page number on page reload
		"initComplete": function(settings, json) {
			//$table.page('last').draw('page');
			
			
		},
		lengthMenu: [10, 20, 100],
        columns: [
            { render: operateFormatter },
			{ "data": "code"},
			{ "data": "desc","width":"250px"},
			{ "data": "location", className: "bold"},
			{ "data": "qty", "searchable": false },
			{ "data": "unit", "searchable": false },
			{ "data": "timestamp"},
			{ "data": "imported"}
        ],
		"order": [[ 6, "desc" ]],
		dom1: "<'row'<'col-sm-6 newButton'><'col-sm-6'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-4'i><'col-sm-2'l><'col-sm-6'p>>",
		dom: 
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-6 newButton'><'col-sm-6'f>>" +
			"<'row'<'col-sm-4'i><'col-sm-2'l><'col-sm-6'p>>",
    } );

	$("div.newButton")
		.append($('<button class="btn btn-app"><i class="fa fa-refresh"></i>Refresh</button>')
			.on('click',function(event){
				$table.ajax.reload(null,false);
				})
		);
		
	//Select menu init
	$('#unitid').each(fillSelect);
	
	//operate
	function operateFormatter(data, type, full, meta) {
		var html = [];
		html.push('<button class="btn btn-default delete"');
		html.push(' data-index="');
		html.push(meta.row); //index
		html.push('"><i class="fa fa-times"></i></button>');
		return html.join('');
    }
	
	

	$table.on( 'draw.dt', setDelete);
	
	//Delete
	function setDelete(){
	$('.delete').on('click',function(event){
		var $e = $(this);
		var index = $e.data('index');
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				$.ajax({
					url: "/admin/script/",
					dataType: 'json',
					data:{action:'deleteStockCheck',id:$table.row( index ).data().id},
					method: "POST",
					beforeSubmit: function(){},
					error: function (data){Swal.fire(data.status.toString(), data.statusText, 'error');}, //ajax error
					success: function(data){
						if(data.status) {
							$table.ajax.reload(null,false);
							//$modal.modal("hide");
							//Swal.fire('Deleted!',data.msg,'success').then((result)=>{$modal.modal("hide");});
							toastr["error"](data.msg);
						} else {
							Swal.fire('Error', data.msg, 'error');
						}
					}
				});
			}
		})
	});
	}
	
	$('#idAddQty').on('click', function(){
		var codes = $("#idbulkcodes").val();
		if (codes.charAt(codes.length-1)=='\n') codes = codes.slice(0,-1);
		$("#idbulkcodes").val(codes+'…');
	});
	
	
	[0,1,2,3,4,5,6,7,8,9,'mm','kg','pc'].forEach(function(item, index){
		$('#idNumbers').append(
			$('<button>',{'class':'btn btn-info','type':'button'}).append(item).on('click',function(event){
				var codes = $("#idbulkcodes").val();
				$("#idbulkcodes").val(codes + event.target.innerText);
			})
		)
	})
	
	
	$('#idBack').on('click', function(){
		var codes = $("#idbulkcodes").val();
		$("#idbulkcodes").val(codes.slice(0,-1));
		//$('#idbulkcodes').focus();
	});
	
	$('#idEnter').on('click', function(){
		var codes = $("#idbulkcodes").val();
		$("#idbulkcodes").val(codes+"\n");
		$('#idbulkcodes').focus();
	});
	
	var bulkTimer;
	$('#bulkbutton').on('click',function(){
		if ($('#idbulkcodes').val()=='') {
			$('#idbulkcodes').focus();
			toastr["error"]('Add codes!');
		} else {
			pushCode();
		}
	});
	
	function pushCode(){
		if ($input.val()!=''){
			$("#idbulkcodes").val($input.val() + "\n" + $("#idbulkcodes").val());
			Swal.fire('Error', $input.val() + ' is not found, or no "Location" is specified!', 'error');
			$input.val('');
		} else if ($("#idbulkcodes").val()!=''){
			var codes= $("#idbulkcodes").val().split("\n");
			var [code,qty,unit]=codes[0].split("…")
			if (qty) $("#qtyid").val(qty);
			if (unit) $("#unitid").val(unit.toLowerCase());
			$input.val(code);
			$input.trigger('keyup');
			codes.shift();
			$("#idbulkcodes").val(codes.join("\n"));
			bulkTimer = setTimeout(pushCode, 3000);
		}
	}
	
	var typingTimer;                //timer identifier
	var sendTimer;
	var doneTypingInterval = 500;  //time in ms, 5 second for example
	var doneEditingInterval = 2000;
	var $input = $('#codeid');

	//on keyup, start the countdown
	$input.on('keyup', function () {
		clearTimeout(typingTimer);
		clearTimeout(sendTimer);
		typingTimer = setTimeout(doneTyping, doneTypingInterval);
		//sendTimer = setTimeout(doneEditing, doneEditingInterval);
	});

	//on keydown, clear the countdown 
	$input.on('keydown', function () {
		clearTimeout(typingTimer);
		clearTimeout(sendTimer);
	});

	//user is "finished typing," do something
	function doneTyping () {
		getValue({action:'getCodeDesc',id:$input.val()}, function(data){
			if (data.data) {
				if (data.data[0].desc) {
					$('#descid').val(data.data[0].desc);
					console.log (data.data[0].unit);
					if (data.data[0].unit) $('#unitid').val(data.data[0].unit); else $('#unitid').val("pc");
          sendTimer = setTimeout(doneEditing, doneEditingInterval);
					//$('#unitid').val(data.data[0].unit);
				} else if (data.data[0].location){
					$('#locationid').val(data.data[0].location);
					$input.val('');
					clearTimeout(typingTimer);
					clearTimeout(sendTimer);
					feedBack(1);
				}
			} else {
				$('#descid').val('');
				clearTimeout(typingTimer);
				clearTimeout(sendTimer);
			}
		})
		
	//do something
	}
	function doneEditing(){
		if ($('#locationid').val()=='') {
			$('#locationid').focus();
			toastr["error"]('Add location!');
			
		} else {
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: '/admin/script/',
				data: $('#inputForm').serialize(), // serializes the form's elements.
				error: function(e,error,errorText,o){
					Swal.fire({icon: 'error',title: "Error",text: error + ": Check with administrator"});
					console.log(e.responseText);
				},
				success: function(data){
					if(data.status) {
						$table.ajax.reload(null,false);
						toastr["info"](data.msg);
						feedBack(0);
					} else {
						Swal.fire({icon: 'error',title: 'Error',text: data.msg});
						//console.log(data);
					}
				} 
			});
			$("#codeid").val('');
			$("#qtyid").val('1');
			$("#unitid").val('pc');
			$("#descid").val('');
		}
	}
	
	$('#codeid,#qtyid,#locationid').on('focus', function () {
		$(this).val('');
	});
	
	if (isMobile){
		//NoSleep
		var noSleep,btnSleep,isON=false;
		$.getScript('/admin/plugins/nosleep/NoSleep.js', function(){
			// Enable wake lock.
			// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
			noSleep = new NoSleep();
			btnSleep = $('<li>');
			btnSleep.append($('<a>').on('click',function(){
				btnSleep.toggleClass('bg-yellow-active color-palette');
				if (isON) noSleep.disable(); else noSleep.enable();
				isON=!isON;
			}).append($('<i class="fa fa-lightbulb-o"></i>')))
			$('ul.navbar-nav').prepend(btnSleep);
		});
	}
	
	function feedBack(type){
		var soundFile;
		switch (type){
			case 0: soundFile = 'SpeechOn'; break;
			case 1: soundFile = 'WindowsExclamation'; break;
			default: soundFile = 'SpeechOn';
		}
		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', '/admin/res/snd/' + soundFile + '.wav');
		audioElement.play();
		
		// enable vibration support
		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
		if (navigator.vibrate) {
			// vibration API supported
			navigator.vibrate(100); //navigator.vibrate([500, 300, 100]);
		}
	}
	
	loadCSS('style.css');
	

});
