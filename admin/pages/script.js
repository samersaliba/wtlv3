$(function() {
	init(); //initialize page

	//data: dataSet,
    var $table=$('#jobs').DataTable( {
        "ajax": {
			url:"/admin/script/",
			data: {action:'dashJobs'},
			dataSrc: function(json){
				toastr["info"]("Data loaded");
				return json.data;
			},
			"type": "POST",
			error: function (xhr, error, code){ 
				toastr["error"](xhr.status + ' - ' + xhr.statusText);
			}
		},
		//"deferRender": false,
		//"responsive": true,
		"scrollX": true,
		"scrollY": '300px',
		"pageLength": 100,
		"initComplete": function(settings, json) {
			//$table.page('last').draw('page');
		},
		language:{
			"info": 'Total <span style="font-size:1.5em">_TOTAL_</span> jobs that need attention!'
		},
        columns: [
			{ "data": "id","orderable": false, 'render': function ( data, type, row ) {
				return '<a href="/admin/pages/job/?s=N' + data + '">N' + data + '</a>';
			}},
			{ "data": "number" },
            { "data": "theirno" },
            { "data": "desc" },
			{ "data": "client",render: function ( data, type, row ) {
					return  data + (row['servicesupplier']==''?'':' <small>('+row['servicesupplier']+')</small>');
				} 
			},
			{ "data": "requestdate"},
            { "data": "offerstatus",
				render: function ( data, type, row ) {
					var b= {'Pricing':'info','Cancelled':'default','Approved':'success','Rejected':'danger','Pending':'warning','Time Sheet':'primary'}
					if (data!='') return  '<span class="label label-' + b[data] + '">' + data + '</span>'; else return data;
				} 
			},
			{ "data": "workstatus",
				render: function ( data, type, row ) {
					var b= {'Finished':'default','Not started':'danger','Paused':'warning','Rejected':'danger','In progress':'success'}
					if (data!='') return  '<span class="label label-' + b[data] + '">' + data + '</span>'; else return data;
				} 
			},
        ],
		"order": [[ 5, "desc" ]],
		columnDefs: [
			{
				"searchable": false,
				"orderable": false,
				"targets": [0,1,2,3,4,6]
			}
			
		],
		dom: "<'row'<'col-sm-12'tr>><'row'<'col-md-12'i>>" 
    } );
	
	//REMINDERS
	function dashReminders(){
		getValue({action: 'dashReminders'},function(data){
			if (data.status){
				if (data.data){
					$('#reminders').empty();
					var a,b,c,d;
					for (var i=0;i<data.data.length;i++){
						a = (new Date() - new Date(data.data[i].changestamp))/parseInt(data.data[i].interval)/10/60/60/24; //%
						if (a>100){
							a=100;
							b = "progress-bar-red";
							c=getInterval(addDays(data.data[i].changestamp, data.data[i].interval));
							d='no time';
						} else {
							a=parseInt(a);
							b='progress-bar-green'; c=0;
							d=getInterval(addDays(data.data[i].changestamp, data.data[i].interval)).substr(1);
						}
						$('#reminders').append(
							$('<li style="padding:auto;position:relative;">')
							.append('<div class="progress" style="margin:0;display:inline-block;width:80px;vertical-align: text-top;"><div class="progress-bar ' + b	+ '" role="progressbar" aria-valuenow="' + a + '" aria-valuemin="0" aria-valuemax="100" style="width:' + a + '%;white-space: nowrap;"> ' + d + ' left </div></div>')
							.append($('<div class="tools">')
								.append($('<i class="fa fa-check" data-id="' + data.data[i].id + '"></i>').on('click',dashReminderReset))
							)//
							.append($('<span class="text">')
								.append((c?'<small class="label label-danger pull-right"><i class="fa fa-clock-o"></i> ' + c + ' late</small>':''))
								.append('<strong>' + data.data[i].machine + '</strong> <span class="text-muted">' + data.data[i].machinename + '</span> - ' + data.data[i].title + ': ' + data.data[i].text)
							)
						)
					}
				}
			}
		});
	}
	dashReminders();
	
	function dashReminderReset(event){
		Swal.fire({
			title: 'Task is done?',
			text: "The reminder counter will be reset.",
			icon: 'warning',
			showCancelButton: true,
			//confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, reset reminder counter!'
		}).then((result) => {
			if (result.value) {
				console.log(this);
				$.ajax({
					url: "/admin/script/",
					dataType: 'json',
					data:{action:'resetReminder',id:$(this).data('id')},
					method: "POST",
					beforeSubmit: function(){},
					error: function (data){Swal.fire(data.status.toString(), data.statusText, 'error');}, //ajax error
					success: function(data){
						if(data.status) {
							dashReminders();
							toastr["info"]("Reminder counter is reset. " + data.msg);
						} else {
							Swal.fire('Error', data.msg, 'error');
						}
					}
				})
			}
		})
	}
	//REMINDERS END
	
	
	
	
	getValue({action: 'offerstatusthisyear'},function(data){
		if (data.status){
			if (data.data){
				var icons={
				'Approved':['fa-check','bg-green'],
				'Cancelled':['fa-close','bg-gray'],
				'Pending':['fa-clock-o','bg-orange'],
				'Pricing':['fa-dollar','bg-aqua'],
				
				'Time Sheet':['fa-table','bg-blue'],
				'Outsourced':['fa-mail-forward','bg-aqua'],
				'Rejected':['fa-close','bg-red'],
				
				'Not started':['fa-clock-o','bg-red'],
				'Finished':['fa-check','bg-gray'],
				'In progress':['fa-play','bg-green'],
				'Paused':['fa-pause','bg-orange']	
				};
				for (var i=0;i<data.data.length;i++){
					$('#offerstatus')
					.append($('<div>',{'class':'col-md-3 col-sm-6 col-xs-12'})
						.append($('<div>',{'class':'info-box'})
							.append($('<span>',{'class':'info-box-icon '+icons[data.data[i].name][1]})
								.append($('<i>',{'class':'fa '+icons[data.data[i].name][0]})
								)
							)
							.append($('<div>',{'class':'info-box-content'})
								.append($('<span>',{'class':'info-box-text'}).append(data.data[i].name))
								.append($('<span>',{'class':'info-box-number'}).append(data.data[i].value+' Jobs'))
								.append($('<small>',{'class':''}).append('This year'))
								
							)
						)
					)
				}
			}
		}

	});
	
	
	//SALES CHART
	var label=Months.slice().rotate(7);
	var datas=new Array(12).fill(0); 
	var datas2=new Array(12).fill(0);
	
	getValue({action: 'offervaluethisyear'},function(data){
		if (data.status){
			if (data.data){
				var d = new Date();
				var n = d.getMonth();
				data.data.forEach(function(value, index, array){
					label[(value.name+n-2)%12]=Months[value.name-1];
					datas[(value.name+n-2)%12]=value.value;
				});
				a1();
			}
		}
	});
function a1(){
	getValue({action: 'invoicingvaluethisyear'},function(data){
		if (data.status){
			if (data.data){
				var d = new Date();
				var n = d.getMonth();
				data.data.forEach(function(value, index, array){
					datas2[(value.name+n-2)%12]=value.value;
				});
				a2();
			}
		}
	});
}

function a2(){
	var salesChartData = {
    labels  : label,
    datasets: [
      {
        label               : 'Approved Offers',
        fillColor           : 'rgb(210, 214, 222)',
        strokeColor         : 'rgb(210, 214, 222)',
        pointColor          : 'rgb(210, 214, 222)',
        pointStrokeColor    : '#c1c7d1',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgb(220,220,220)',
        data                : datas
      },
	  {
        label               : 'Invoiced',
        fillColor           : 'rgba(60,141,188,0.9)',
        strokeColor         : 'rgba(60,141,188,0.8)',
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(60,141,188,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data                : datas2
      }
    ]
  };
	// Create the line chart
	salesChart.Line(salesChartData, salesChartOptions);
}

  var salesChartCanvas = $('#offerChart').get(0).getContext('2d');
  var salesChart       = new Chart(salesChartCanvas);
  var salesChartOptions = {
    showScale               : true, // Boolean - If we should show the scale at all
    scaleShowGridLines      : false, // Boolean - Whether grid lines are shown across the chart
    scaleGridLineColor      : 'rgba(0,0,0,.05)', // String - Colour of the grid lines
    scaleGridLineWidth      : 1, // Number - Width of the grid lines
    scaleShowHorizontalLines: true, // Boolean - Whether to show horizontal lines (except X axis)
    scaleShowVerticalLines  : true, // Boolean - Whether to show vertical lines (except Y axis)
    bezierCurve             : true, // Boolean - Whether the line is curved between points
    bezierCurveTension      : 0.3, // Number - Tension of the bezier curve between points
    pointDot                : false, // Boolean - Whether to show a dot for each point
    pointDotRadius          : 4, // Number - Radius of each point dot in pixels
    pointDotStrokeWidth     : 1, // Number - Pixel width of point dot stroke
    pointHitDetectionRadius : 20, // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    datasetStroke           : true, // Boolean - Whether to show a stroke for datasets
    datasetStrokeWidth      : 2, // Number - Pixel width of dataset stroke
    datasetFill             : true, // Boolean - Whether to fill the dataset with a color
    // String - A legend template
    legendTemplate          : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<datasets.length; i++){%><li><span style=\'background-color:<%=datasets[i].lineColor%>\'></span><%=datasets[i].label%></li><%}%></ul>',
    maintainAspectRatio     : true, // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    responsive              : true, // Boolean - whether to make the chart responsive to window resizing
  };
  
  //DAYS OFF
  getValue({action: 'daysoff'},function(data){
		if (data.status){
			if (data.data){
				for (i=0;i<data.data.length;i++){
					$('#daysoff').append('<div class="progress-group">'
                    + '<span class="progress-text">' + data.data[i].name + ' <a href="/admin/pages/worktime/?s=' + data.data[i].name + ' Leave"><i class="fa fa-external-link-square"></i></a></span>'
                    + '<span class="progress-number"><b>' + data.data[i].value + '</b>/' + data.data[i].limit + '</span>'
                    + '<div class="progress sm">'
                    + '  <div class="progress-bar ' + (data.data[i].value>data.data[i].limit?'progress-bar-red':'progress-bar-aqua') + '" style="width: ' + (data.data[i].value/data.data[i].limit*100) + '%"></div>'
                    + '</div>'
                    + '</div>'
					);
				}
			}
		}
  });
  
  //CHECK Backup
  getValue({action: 'checkbackup'},function(data){
		if (data.status){
			var diff=(new Date() - new Date(data.data[0].value))/1000/60/60; //Hours
			if (diff>48){
				/*
				$('.content-wrapper').prepend('<section class="content-header"><div class="row"><div class="col-md-12"><div class="alert alert-danger" role="alert">'
				+ '<i class="fa fa-exclamation-triangle"></i> <strong>Backup!</strong> you need to do backup for all files and databases. Usually you should execut the Backup.cmd in "N:\\SOMP\\scripts" from Samer-w7.'
				+ '</div></div></div></div>'
				);
				*/
				$('.content').prepend(
				'<div class="row">'

				+ '<div class="col-md-12"><div class="callout callout-warning">'
				+ '<h4><i class="fa fa-exclamation-triangle"></i> Backup!</h4>'
				+ 'you need to do backup for all files and databases. Usually you should execute the Backup.cmd in "N:\\SOMP\\scripts" from Samer-w7.'
				+ '</div></div>'
				
				+ '</div>'
				)
				
			}
		}
  });
  
  //DASHBOARD2
   /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  // -----------------------
  // - MONTHLY SALES CHART -
  // -----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var salesChartCanvas1 = $('#salesChart').get(0).getContext('2d');
  // This will get the first returned node in the jQuery collection.
  var salesChart1       = new Chart(salesChartCanvas1);

  var salesChartData1 = {
    labels  : ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label               : 'Electronics',
        fillColor           : 'rgb(210, 214, 222)',
        strokeColor         : 'rgb(210, 214, 222)',
        pointColor          : 'rgb(210, 214, 222)',
        pointStrokeColor    : '#c1c7d1',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgb(220,220,220)',
        data                : [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label               : 'Digital Goods',
        fillColor           : 'rgba(60,141,188,0.9)',
        strokeColor         : 'rgba(60,141,188,0.8)',
        pointColor          : '#3b8bba',
        pointStrokeColor    : 'rgba(60,141,188,1)',
        pointHighlightFill  : '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data                : [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var salesChartOptions1 = {
    // Boolean - If we should show the scale at all
    showScale               : true,
    // Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines      : false,
    // String - Colour of the grid lines
    scaleGridLineColor      : 'rgba(0,0,0,.05)',
    // Number - Width of the grid lines
    scaleGridLineWidth      : 1,
    // Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    // Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines  : true,
    // Boolean - Whether the line is curved between points
    bezierCurve             : true,
    // Number - Tension of the bezier curve between points
    bezierCurveTension      : 0.3,
    // Boolean - Whether to show a dot for each point
    pointDot                : false,
    // Number - Radius of each point dot in pixels
    pointDotRadius          : 4,
    // Number - Pixel width of point dot stroke
    pointDotStrokeWidth     : 1,
    // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius : 20,
    // Boolean - Whether to show a stroke for datasets
    datasetStroke           : true,
    // Number - Pixel width of dataset stroke
    datasetStrokeWidth      : 2,
    // Boolean - Whether to fill the dataset with a color
    datasetFill             : true,
    // String - A legend template
    legendTemplate          : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<datasets.length; i++){%><li><span style=\'background-color:<%=datasets[i].lineColor%>\'></span><%=datasets[i].label%></li><%}%></ul>',
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio     : true,
    // Boolean - whether to make the chart responsive to window resizing
    responsive              : true
  };

  // Create the line chart
  salesChart1.Line(salesChartData1, salesChartOptions1);

  // ---------------------------
  // - END MONTHLY SALES CHART -
  // ---------------------------

  // -------------
  // - PIE CHART -
  // -------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d');
  var pieChart       = new Chart(pieChartCanvas);
  var PieData        = [
    {
      value    : 700,
      color    : '#f56954',
      highlight: '#f56954',
      label    : 'Chrome'
    },
    {
      value    : 500,
      color    : '#00a65a',
      highlight: '#00a65a',
      label    : 'IE'
    },
    {
      value    : 400,
      color    : '#f39c12',
      highlight: '#f39c12',
      label    : 'FireFox'
    },
    {
      value    : 600,
      color    : '#00c0ef',
      highlight: '#00c0ef',
      label    : 'Safari'
    },
    {
      value    : 300,
      color    : '#3c8dbc',
      highlight: '#3c8dbc',
      label    : 'Opera'
    },
    {
      value    : 100,
      color    : '#d2d6de',
      highlight: '#d2d6de',
      label    : 'Navigator'
    }
  ];
  var pieOptions     = {
    // Boolean - Whether we should show a stroke on each segment
    segmentShowStroke    : true,
    // String - The colour of each segment stroke
    segmentStrokeColor   : '#fff',
    // Number - The width of each segment stroke
    segmentStrokeWidth   : 1,
    // Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    // Number - Amount of animation steps
    animationSteps       : 100,
    // String - Animation easing effect
    animationEasing      : 'easeOutBounce',
    // Boolean - Whether we animate the rotation of the Doughnut
    animateRotate        : true,
    // Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale         : false,
    // Boolean - whether to make the chart responsive to window resizing
    responsive           : true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio  : false,
    // String - A legend template
    legendTemplate       : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
    // String - A tooltip template
    tooltipTemplate      : '<%=value %> <%=label%> users'
  };
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);
  // -----------------
  // - END PIE CHART -
  // -----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */
  $('#world-map-markers').vectorMap({
    map              : 'world_mill_en',
    normalizeFunction: 'polynomial',
    hoverOpacity     : 0.7,
    hoverColor       : false,
    backgroundColor  : 'transparent',
    regionStyle      : {
      initial      : {
        fill            : 'rgba(210, 214, 222, 1)',
        'fill-opacity'  : 1,
        stroke          : 'none',
        'stroke-width'  : 0,
        'stroke-opacity': 1
      },
      hover        : {
        'fill-opacity': 0.7,
        cursor        : 'pointer'
      },
      selected     : {
        fill: 'yellow'
      },
      selectedHover: {}
    },
    markerStyle      : {
      initial: {
        fill  : '#00a65a',
        stroke: '#111'
      }
    },
    markers          : [
      { latLng: [41.90, 12.45], name: 'Vatican City' },
      { latLng: [43.73, 7.41], name: 'Monaco' },
      { latLng: [-0.52, 166.93], name: 'Nauru' },
      { latLng: [-8.51, 179.21], name: 'Tuvalu' },
      { latLng: [43.93, 12.46], name: 'San Marino' },
      { latLng: [47.14, 9.52], name: 'Liechtenstein' },
      { latLng: [7.11, 171.06], name: 'Marshall Islands' },
      { latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' },
      { latLng: [3.2, 73.22], name: 'Maldives' },
      { latLng: [35.88, 14.5], name: 'Malta' },
      { latLng: [12.05, -61.75], name: 'Grenada' },
      { latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines' },
      { latLng: [13.16, -59.55], name: 'Barbados' },
      { latLng: [17.11, -61.85], name: 'Antigua and Barbuda' },
      { latLng: [-4.61, 55.45], name: 'Seychelles' },
      { latLng: [7.35, 134.46], name: 'Palau' },
      { latLng: [42.5, 1.51], name: 'Andorra' },
      { latLng: [14.01, -60.98], name: 'Saint Lucia' },
      { latLng: [6.91, 158.18], name: 'Federated States of Micronesia' },
      { latLng: [1.3, 103.8], name: 'Singapore' },
      { latLng: [1.46, 173.03], name: 'Kiribati' },
      { latLng: [-21.13, -175.2], name: 'Tonga' },
      { latLng: [15.3, -61.38], name: 'Dominica' },
      { latLng: [-20.2, 57.5], name: 'Mauritius' },
      { latLng: [26.02, 50.55], name: 'Bahrain' },
      { latLng: [0.33, 6.73], name: 'São Tomé and Príncipe' }
    ]
  });

  /* SPARKLINE CHARTS
   * ----------------
   * Create a inline charts with spark line
   */

  // -----------------
  // - SPARKLINE BAR -
  // -----------------
  $('.sparkbar').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type    : 'bar',
      height  : $this.data('height') ? $this.data('height') : '30',
      barColor: $this.data('color')
    });
  });

  // -----------------
  // - SPARKLINE PIE -
  // -----------------
  $('.sparkpie').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type       : 'pie',
      height     : $this.data('height') ? $this.data('height') : '90',
      sliceColors: $this.data('color')
    });
  });

  // ------------------
  // - SPARKLINE LINE -
  // ------------------
  $('.sparkline').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type     : 'line',
      height   : $this.data('height') ? $this.data('height') : '90',
      width    : '100%',
      lineColor: $this.data('linecolor'),
      fillColor: $this.data('fillcolor'),
      spotColor: $this.data('spotcolor')
    });
  });

});



