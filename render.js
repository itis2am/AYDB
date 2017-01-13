//--------== PULL DATA AND GENERATE DIVS ==--------
$.get('data.csv', function(data) {

	// start the table	
	var html = '';

	// split into lines
	var rows = data.split("\n");
	
	var n = 1;
	
	// parse lines
	rows.forEach( function getvalues(ourrow)
	{
		if(ourrow!='')
		{
			// split line into columns
			var columns = ourrow.split(",");
			
			var vx = +columns[6];
			var vy = +columns[7];
			
			html += "<div id=\"ConnectBox"+n+"\" class=\"ContainerBox\" style=\"cursor:move; font-size:80%; padding:5px; text-align:center; width:auto; height:auto; border:1px solid #000; position:absolute; left:" + vx + "px; top:" + vy + "px;\">" + columns[1] + "</div>";
		}
		n += 1;
	})

	// insert into div
	$('#container').append(html);
});

//--------== MAKE CONNECTIONS ==--------
jsPlumb.bind("ready", function() {

	$.get('data.csv', function(data)
	{
		// split into lines
		var rows = data.split("\n");
	
		var n = 1;
		
		var connectionInstance = jsPlumb.getInstance();
		connectionInstance.importDefaults({
			Connector : [ "Bezier", { curviness: 50 }],
			//Connector : ["Flowchart"],
			Anchors : [ "TopCenter", "BottomCenter" ],
			ConnectionsDetachable : false,
			//Endpoints : ["Blank","Blank"],
			Endpoints : [ [ "Dot", { radius:7.5 } ], [ "Dot", { radius:7.5 } ] ],
			//Overlays : [ ["Arrow", {direction:-1, location:0.25, foldback:0.1, width:10, length:10}] ],
			PaintStyle:{ stroke:"#456", strokeWidth:1 },
			HoverPaintStyle:{ stroke:"lightgreen", strokeWidth:5 }
		});
		
		rows.forEach( function getvalues(ourrow)
		{
			var columns = ourrow.split(",");
			
			if(+columns[4]!=0 && columns[4]!=null)
			{
				connectionInstance.connect({
					source:"ConnectBox"+n, 
					target:"ConnectBox"+columns[4]
				});
			}
			if(+columns[5]!=0 && columns[5]!=null)
			{
				connectionInstance.connect({
					source:"ConnectBox"+n, 
					target:"ConnectBox"+columns[5],
					paintStyle:{ stroke:"red", strokeWidth:1 }
				});
			}
			n+=1;
		})
		connectionInstance.draggable($(".ContainerBox"));
	});
});

//--------== PUSH DATA ==--------
$('.fileGen').click(function() {
	if( confirm('A new export file will be created.'))
	{
		$.ajax({
			type: "POST", url: "export.php", data: {fxname: "getDatedFile"}, async: false,
		})
		.done(function(Echo){// if not nested, ".done" will execute after all "$.ajax" are executed (asynchronous)
			
			$.get('data.csv', function(data){
			
				// split into lines
				var rows = data.split("\n");
			
				for( i_box = 1; i_box <= $(".ContainerBox").length; i_box++)
				{
					var columns = rows[i_box-1].split(",");
					prefix = columns[1]+','+columns[2]+','+columns[3]+','+columns[4]+','+columns[5];
				
					var FetchPos = $("#ConnectBox" + i_box).position();
					$.ajax({
						type: "POST", url: "export.php",
						data: {fxname: "writeFile", fileref: Echo, id:i_box, px: Math.round(FetchPos.left), py: Math.round(FetchPos.top), pre: prefix},
						async: false // to handle unwanted data reordering due to multiple asynchronous requests
					});
				}
			});
			alert( "Data Saved: File generated in " + Echo);
		});
	}
});