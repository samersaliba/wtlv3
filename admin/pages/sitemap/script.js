$(function() {
	init(); //initialize page
	//addModal('users');
  loadCSS ('zTreeStyle/css/zTreeStyle.css');
  
  var setting = {
    data: {
      simpleData: {
        enable: true
      }
    },
    view: {
      addHoverDom: addHoverDom,
      removeHoverDom: removeHoverDom,
      selectedMulti: false
    },
    edit: {
      enable: false,
			showRemoveBtn: false,
			showRenameBtn: false
    },
    async: {
      enable: true,
			url:"/admin/script/",
			otherParam:{'action':'getSitemap'},
			dataFilter: filter
		}
  
  };

	function addHoverDom(treeId, treeNode) {
		var sObj = $("#" + treeNode.tId + "_span");
  	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
		var addStr = "<span class='button edit' id='addBtn_" + treeNode.tId
			+ "' title='edit node' onfocus='this.blur();'></span>";
		sObj.after(addStr);
		var btn = $("#addBtn_"+treeNode.tId);
		if (btn) btn.bind("click", function(){
      window.location.href = "/admin/pages/articles/?s="+treeNode.uid;
			return false;
		});
	};
	
  function removeHoverDom(treeId, treeNode) {
		$("#addBtn_"+treeNode.tId).unbind().remove();
	};

  function filter(treeId, parentNode, childNodes) {
    childNodes = childNodes.data;
		if (!childNodes) return null;
		for (var i=0, l=childNodes.length; i<l; i++) {
			childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
		}
		return childNodes;
	}

		
	$.fn.zTree.init($("#treeDemo"), setting);
		
  
  
	//Tmain table init
	/*
  $.extend(true,TmainOptions,{
		ajax:{
			data:{action:'listWriters'}
		},
    columns: [
      { render: operateFormatter },
			{ "title":"Name", "data": 1 }, 
			{ "title":"Picture", "data": 2 },
			{ "title":"Deleted", "data": 3 }
    ],
		"order": [[ 1, "asc" ]],
		columnDefs: [
			{
				render: overflowHandle,
        targets: [1]
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

		//$("#idCompanyIDtxt").text(''); //reset info elements
		if ($e.hasClass("new")) {
			$form.trigger("reset"); //reset form 
		} else if ($e.hasClass("open")) {
			var row = $table.row( $e.data('index') ).data();
			$("#id").val(row[0]);
			$("#idName").val(row[1]);
			$("#idPicture").val(row[2]);
			$("#idDeleted").val(row[3]);
			
			//if ($("#idCompanyID").val()!=row[16]) $("#idCompanyIDtxt").text(row[1]);
		}
		//if ($e.is('.new,.open')) $('#idCompanyID').each(function(){ $(this).trigger('change'); }); //select2 elements
	})
	
	//Select menu init
	//$('#idCompanyID').each(fillSelect);
	
	// bind 'Form' and provide a simple callback function
	$.extend(myFormOptions,{data: {action:'editWriters'}});
	$form.ajaxForm(myFormOptions);
	
	//Delete
	doDelete("deleteWriters");
  */
});

