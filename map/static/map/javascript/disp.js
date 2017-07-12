//James Page
//this is the javascript file for creating a grid that represents a map


function tableFunction(arg){
	var jsonObject = JSON.parse(arg);
	var max_density = 0;
	var max_den_in = 0;
	var second_place = 0;
	var i = 0;
	while(jsonObject[i]){
		if ((jsonObject[i].fields.population/jsonObject[i].fields.size) > max_density){
			second_place = max_density
			max_density = (jsonObject[i].fields.population/jsonObject[i].fields.size)
			max_den_in = i;
		}
		i++;
	}

	var text = "";
	var j = 0;
	var k;
	text = "<table class = \"table2\" style=\"width:100%\">"
	while(jsonObject[j]){
		var op = (jsonObject[j].fields.population/jsonObject[j].fields.size *1.0)/
		second_place
		if ((j % 10) == 0){
			text+="<tr>";
		}
		text+="<td style=\"background-color:rgba(0, 130, 0," + op + ");\">.</td>";
		if (j % 10 == 9){
			text+="</tr>";
		}
		j++;
	}
	text+="</table>";
	document.getElementById("test").innerHTML = text;
	//document.getElementById("test").innerHTML = jsonObject[max_den_in].pk;
}
