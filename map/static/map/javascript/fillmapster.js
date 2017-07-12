//This script is for filling up the map with the appropriate colors
//I still need to find a way to do it using a loop
//Also I need to generalize so that can get any bit of data

//This function is for displaying state information with it is clicked on
function displayState(stateEvent, jsonObj, metric, ave){
	
	//display state image if no metric is sepected
	if (metric == 0){
		var text = loadState(stateEvent, jsonObj);
		document.getElementById("stateTable").innerHTML = "";
		document.getElementById("stateImg").innerHTML = text;
	}

	//display table if metric is selected
	else {
		if ((document.getElementById("table2")) != null){
			updateTable(stateEvent, jsonObj, metric, ave);
		}
		else {
			var text = createTable(stateEvent, jsonObj, metric, ave);
			document.getElementById("stateTable").innerHTML = text;
		}
		document.getElementById("stateImg").innerHTML = "";
	}
}

//function that returns html call to open an image of a specified state along with 
//a table of its information
function loadState(stateEvent, jsonObj){
	var height = document.getElementById('first').offsetHeight;
	var name = stateEvent.key.toLowerCase().replace(/\s+/g, '');
	text = "<h2><center>" + stateEvent.key + "</center></h2>";
	text += "<div height = \"" + height/3 + "px\"><center><img src=\"./../../static/map/images/states/" +
	name + ".svg\" style = \"max-height:" + height/3 + "px; width: auto; height: auto\\9;\"height=\"" + 
	height/3 + "\"></center></div>";


	text += "<table id = \"table1\" style=\"width:100%\">"
	text += "<tr>";
	text += "<th></th><th>" + stateEvent.key + ":</th>";
	text += "</tr>";

	
	var j = 0;
	while(jsonObj[j]){
		if(jsonObj[j].pk ==stateEvent.key){
			text += "<tr>";
			val = (jsonObj[j].fields.population/jsonObj[j].fields.size);
			met = "Population Density";
			text += "<th>" + met + "</th><td>" + val.toPrecision(3) + "</td>";
			text += "</tr>";
			
			text += "<tr>";
			val = (jsonObj[j].fields.employment/jsonObj[j].fields.population);
			met = "Percent Employment";
			text += "<th>" + met + "</th><td>" + (val*100).toPrecision(3) + "</td>";
			text += "</tr>";
		}
		j++;
	}

	text += "</table>";


	return text
}

//this function updates the table if it already exists and is the right metric
function updateTable(stateEvent, jsonObj, metric, ave){
	var table = document.getElementById("table2");
	console.log(table.className);
	if (table.className.charAt(1) == metric){

		for (var i = 0, row; row = table.rows[i]; i++) {
		   //iterate through rows of table
		   if (row.id == stateEvent.key){
		   		table.deleteRow(i);
		   		return;
		   }
		 
		}

		var row = table.insertRow(table.rows.length-2);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		row.id = stateEvent.key;
		cell1.innerHTML = "<center>" + stateEvent.key + "</center>";

		var j = 0;
		var val = 0;
		while(jsonObj[j]){
			if(jsonObj[j].pk ==stateEvent.key){
				if(metric == 1){
					val = (jsonObj[j].fields.population/jsonObj[j].fields.size);
				}
				else if(metric ==2){
					val = (jsonObj[j].fields.employment/jsonObj[j].fields.population);
				}
			}
			j++;
		}
		cell2.innerHTML = val.toPrecision(3);
	}
	else {
		var text = createTable(stateEvent, jsonObj, metric, ave);
		document.getElementById("stateTable").innerHTML = text;
	}
}


//this function is for creating a table to compare states based on a selected metric
function createTable(stateEvent, jsonObj, metric, ave){
	var text2 = "";
	var unit = "";
	var met = "";
	var j = 0;
	var val = 0;
	while(jsonObj[j]){
		if(jsonObj[j].pk ==stateEvent.key){
			if(metric == 1){
				val = (jsonObj[j].fields.population/jsonObj[j].fields.size);
				unit = "number of people per square mile";
				met = "Population Density";
			}
			else if(metric ==2){
				val = (jsonObj[j].fields.employment/jsonObj[j].fields.population);
				unit = "proportion of population employed";
				met = "Percent Emplyment";
			}
		}
		j++;
	}



	text2 += "<table id = \"table2\" class = \"c" + String(metric) + "\" style=\"width:100%\">"
	text2 += "<tr>";
	text2 += "<th>State:</th><th>" + met + ":</th>";
	text2 += "</tr>";
	text2 += "<tr id = \"" + stateEvent.key + "\">";
	text2 += "<td><center>" + stateEvent.key + "</center></td><td>" + val.toPrecision(3) + "</td>";
	text2 += "</tr>";
	text2 += "<tr id = \"Average\">";
	text2 += "<th>Average</th><td>"+ ave.toPrecision(3) + "</td>";
	text2 += "</tr>";
	text2 += "<tr>";
	text2 += "<th id = \"label\" colspan=\"2\">" + unit + "</th>";
	text2 += "</tr>";
	text2 += "</table>";

	return text2;
}

//this function is for filling in states with appropriate highlighting
function fillMap(arg, metric){
	var jsonObject = JSON.parse(arg);
	var max_density = 0;
	var min_density = Number.MAX_SAFE_INTEGER;
	var second_place = 0;
	var total = 0;
	var i = 0;
	var opacity_list = [];
	if(metric == 0){
		document.getElementById("searchText").innerHTML = "Choose Metric ...";
		var i;
		for(i = 0;i<51;i++){
			opacity_list.push(0);
		}
		document.getElementById("stateTable").innerHTML = "";
	}
	if(metric == 1){
		document.getElementById("stateImg").innerHTML = "";
		document.getElementById("searchText").innerHTML = "Population Density";
		while(jsonObject[i]){
			var den = (jsonObject[i].fields.population/jsonObject[i].fields.size)
			if(i != 8){
				total += den;
			}
			if (den > max_density){
				second_place = max_density;
				max_density = den;
			}
			else if (den > second_place){
				second_place = den
			}
			if(den < min_density){
				min_density = den;
			}
			i++;
		}
		i = 0;
		while(jsonObject[i]){
			var den = jsonObject[i].fields.population/jsonObject[i].fields.size * 1.0;
			var opacity = (den-min_density)/(second_place-min_density);
			opacity_list.push(opacity);
			i++;
		}
	}
	if(metric == 2){
		document.getElementById("stateImg").innerHTML = "";
		document.getElementById("searchText").innerHTML = "Percent Employment";
		while(jsonObject[i]){
			var den = (jsonObject[i].fields.employment/jsonObject[i].fields.population);
			if(i != 8){
				total += den;
			}
			if (den > max_density){
				second_place = max_density;
				max_density = den;
			}
			else if (den > second_place){
				second_place = den
			}
			if(den < min_density){
				min_density = den;
			}
			i++;
		}
		i = 0;
		while(jsonObject[i]){
			var den = jsonObject[i].fields.employment/jsonObject[i].fields.population * 1.0
			var opacity = (den-min_density)/(second_place-min_density);
			opacity_list.push(opacity);
			i++;
		}
	}

	if(metric != 0){
		document.getElementById("legendLeast").innerHTML = min_density.toPrecision(3);
		document.getElementById("legendAve").innerHTML = (total/50).toPrecision(3);
		document.getElementById("legendMost").innerHTML = max_density.toPrecision(3);
	}
	else{
		document.getElementById("legendLeast").innerHTML = " ";
		document.getElementById("legendAve").innerHTML = " ";
		document.getElementById("legendMost").innerHTML = " ";
	}

	$(document).ready(function(){
				$('#usa')
					.mapster({
						mapKey: 'data-key',
					    fillOpacity: 1,
					    strokeColor: '000000',
					    strokeWidth: 3,
					    stroke: true,
					    onClick: function(e){
					    	displayState(e, jsonObject, metric, total/50);
					    },
					    render_highlight: {
					    	fill: false,
					    	strokeWidth: 3,
					    },
					    render_select: {
					    	fill: true,  
					        fillColor: 'ff000c',
					        stroke: true,
					    },
					    //I have not found a way to make this a loop, so every state (area) has its own section
					    areas: [
					    	{
					            key: jsonObject[0].pk,
					            stroke: true,
					            selected: true,
					            staticState: true,
					            render_select: { 
					        	    fillOpacity: opacity_list[0]
				            }},
				            {
				            	key: jsonObject[1].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[1]
				            	}
				            },
				            {
				            	key: jsonObject[2].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[2] 
				            	}
				            },
				            {
				            	key: jsonObject[3].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[3]
				            	}
				            },
				            {
				            	key: jsonObject[4].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[4] 
				            	}
				            },
				            {
				            	key: jsonObject[5].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[5]
				            	}
				            },
				            {
				            	key: jsonObject[6].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[6]
				            	}
				            },
				            {
				            	key: jsonObject[7].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[7]
				            	}
				            },
				            {
				            	key: jsonObject[8].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[8]
				            	}
				            },
				            {
				            	key: jsonObject[9].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[9]
				            	}
				            },
				            {
				            	key: jsonObject[10].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[10]
				            	}
				            },
				            {
				            	key: jsonObject[11].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[11]
				            	}
				            },
				            {
				            	key: jsonObject[12].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[12] 
				            	}
				            },
				            {
				            	key: jsonObject[13].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[13]
				            	}
				            },
				            {
				            	key: jsonObject[14].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[14] 
				            	}
				            },
				            {
				            	key: jsonObject[15].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[15]
				            	}
				            },
				            {
				            	key: jsonObject[16].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[16]
				            	}
				            },
				            {
				            	key: jsonObject[17].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[17]
				            	}
				            },
				            {
				            	key: jsonObject[18].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[18]
				            	}
				            },
				            {
				            	key: jsonObject[19].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[19]
				            	}
				            },
				            {
				            	key: jsonObject[20].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[20]
				            	}
				            },
				            {
				            	key: jsonObject[21].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[21]
				            	}
				            },
				            {
				            	key: jsonObject[22].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[22] 
				            	}
				            },
				            {
				            	key: jsonObject[23].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[23]
				            	}
				            },
				            {
				            	key: jsonObject[24].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[24] 
				            	}
				            },
				            {
				            	key: jsonObject[25].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[25]
				            	}
				            },
				            {
				            	key: jsonObject[26].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[26]
				            	}
				            },
				            {
				            	key: jsonObject[27].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[27]
				            	}
				            },
				            {
				            	key: jsonObject[28].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[28]
				            	}
				            },
				            {
				            	key: jsonObject[29].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[29]
				            	}
				            },
				            {
				            	key: jsonObject[30].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[30]
				            	}
				            },
				            {
				            	key: jsonObject[31].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[31]
				            	}
				            },
				            {
				            	key: jsonObject[32].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[32] 
				            	}
				            },
				            {
				            	key: jsonObject[33].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[33]
				            	}
				            },
				            {
				            	key: jsonObject[34].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[34] 
				            	}
				            },
				            {
				            	key: jsonObject[35].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[35]
				            	}
				            },
				            {
				            	key: jsonObject[36].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[36]
				            	}
				            },
				            {
				            	key: jsonObject[37].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[37]
				            	}
				            },
				            {
				            	key: jsonObject[38].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[38]
				            	}
				            },
				            {
				            	key: jsonObject[39].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[39]
				            	}
				            },
				            {
				            	key: jsonObject[40].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[40]
				            	}
				            },
				            {
				            	key: jsonObject[41].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[41]
				            	}
				            },
				            {
				            	key: jsonObject[42].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[42] 
				            	}
				            },
				            {
				            	key: jsonObject[43].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[43]
				            	}
				            },
				            {
				            	key: jsonObject[44].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[44] 
				            	}
				            },
				            {
				            	key: jsonObject[45].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[45]
				            	}
				            },
				            {
				            	key: jsonObject[46].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[46]
				            	}
				            },
				            {
				            	key: jsonObject[47].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[47]
				            	}
				            },
				            {
				            	key: jsonObject[48].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[48]
				            	}
				            },
				            {
				            	key: jsonObject[49].pk,
				            	stroke: true,
				            	selected: true,
					            staticState: true,
				            	render_select: { 
				                	fillOpacity: opacity_list[49]
				            	}
				            }]
				    })
					.mapster('resize', document.getElementById('first').offsetWidth);
	});
}



//THE FOLLOWING CODE IS FOR RESIZING THE IMAGES
//MOST OF THE CODE WAS TAKEN FROM IMAGEMAPSTER DOCS

//the following variables are used for resizing the imagemap
var resizeTime = 0;     // total duration of the resize effect, 0 is instant
var resizeDelay = 500;	  // time to wait before checking the window size again. 

//functions loads imagemap and then resizes it
function resize(maxWidth) {
    	var image =  $('#usa');
    	image.mapster('resize', maxWidth, resizeTime);   
	}


//onWindowResize tests to see whether div 'first' size has stopped changing
//and passes new size to resize() function if it has
function onWindowResize() {
    var curWidth = document.getElementById('first').offsetWidth,
        checking=false;
    if (checking) {
        return;
    }
    checking = true;
    window.setTimeout(function() {
        var newWidth = document.getElementById('first').offsetWidth;
        if (newWidth === curWidth) {
            resize(newWidth); 
        }
        checking=false;
    },resizeDelay );
}

$(window).bind('resize',onWindowResize);