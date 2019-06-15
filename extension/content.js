function extractNumberGrade(str){
	var s = "";
	for(var i = 0; i < str.length; i++){
		if(str[i] >= '0' && str[i] <= '9' || str[i] == '.') s += str[i];

	}
	if(s == "--" || s == "[ i ]") return NaN;
	return parseFloat(s);;
}
function classData(){
	src = document.documentElement.outerHTML;
	var classes = document.querySelectorAll('tr[id^="ccid"]');


	var data = [];

	for(var i = 0; i < classes.length; i++){
		var class_data = classes.item(i).querySelector('td[align="left"]');

		var name = class_data.textContent.substring(0,class_data.textContent.indexOf("Details" , 0));
		if(name[0] == '~') continue; //Not included in GPA

		var info = classes.item(i).querySelectorAll('td');
		var grades = [name, "N", "N", "N", "N"];

		var hours = info.item(0).textContent;



		for(var j = 0; j < info.length; j++){
			var elt = info.item(j);
			var elta = elt.querySelector('a');

			if(elta == null) continue;
			// console.log(elta.textContent)
			var href = elta.href;
			if(href.substring(href.length - 2) == "T1"){
				grades[1] = extractNumberGrade(elta.textContent);
			}
			if(href.substring(href.length - 2) == "T2"){
				grades[2] = extractNumberGrade(elta.textContent);
			}
			if(href.substring(href.length - 2) == "T3"){
				grades[3] = extractNumberGrade(elta.textContent);
			}
			if(href.substring(href.length - 2) == "Y1"){
				grades[4] = extractNumberGrade(elta.textContent);
			}
		}

		data.push(grades);
	}

	return data;
}



chrome.storage.local.get("grades", function(key){
	var current_data = classData();
	var previous_data = key.grades
	// var previous_data = [
	// 		["AP Micro Economics ", 90, 94.1, 96.2, 95.4],
	// 		["IB Literature_Language I HL ", 95.9, 93.6, 52, 95.4],
	// 		["AP Calculus AB ", 97.5, 93.9, 98.5, 96.6],
	// 		["Adv Topics Comp Science ", 80, 96.3, 93, 30],
	// 		["Physics ", 95, 99.1, 94.8, 96.3],
	// 		["Simulations and Num Models ", "N", 95, "N", "N"],
	// 		["IB Hist of Amer I HL ", 94.2, 93.9, 92.3, 93.4],
	// 		["IB Espanol IV SL ", 96.1, 95.4, 92.1, 90.3],
	// 		["Structured Query Lang ", "N", 70, "N", "N"],
	// 		["Artificial Intelligence ", "N", "N", 91.8, "N"]
	// 	];
	changes = [];
	if(previous_data !== undefined){

		console.log("current_data");
		console.log(current_data)
		console.log("previous_data");
		console.log(previous_data)

		// Subject - Current - Previous - Change - DateUpdated


		for (subjectIndex = 0; subjectIndex < current_data.length; subjectIndex++){

			for (sectionIndex = 1; sectionIndex < current_data[subjectIndex].length; sectionIndex++){


				if (previous_data[subjectIndex][sectionIndex] != current_data[subjectIndex][sectionIndex]){


					var subject = current_data[subjectIndex][0];
					var before = previous_data[subjectIndex][sectionIndex]
					var after = current_data[subjectIndex][sectionIndex];
					var change = (current_data[subjectIndex][sectionIndex] - previous_data[subjectIndex][sectionIndex]).toFixed(1);
					var today = new Date();
					today = String(today.getMonth() + 1).padStart(2, '0') + '/' + String(today.getDate()).padStart(2, '0') + '/' + today.getFullYear();

					tri = "Year";
					if (sectionIndex == 1) tri = "T1";
					else if (sectionIndex == 2) tri = "T2";
					else if (sectionIndex == 3) tri = "T3";

					changelog = [subject, tri, before, after, change, today];

					changes.push(changelog);

				}
			}
		}
	} else{
		console.log("First Scraping")
	}


	chrome.storage.local.get("tr", function(key){
		var new_tr = "";
		var tr = key.tr;


		for (i=changes.length-1; i >= 0; i--){
			var td = "";
			for (j=0; j<changes[i].length; j++){
				td += "<td align='left'>"+changes[i][j]+"</td>";
			}
			new_tr ="<tr>"+td+"</tr>" + new_tr;


		}



		var historybox = document.createElement("h3");
		var tableHTML = "<div style='overflow-y: scroll; height: 200px;'><table><tr><td>Subject</td><td>Tri</td><td>Before</td><td>After</td><td>Change</td><td>Date Updated</td></tr>" + new_tr + tr + "</table></div>";
		if (changes.length == 0){
			tableHTML = "<p>No Recent Updates</p>" + tableHTML;
		} else{
			tableHTML = "<p>New Update</p>" + tableHTML;
		}
		historybox.innerHTML = tableHTML;

		var contentArea = document.getElementById("content-main");
		var box = contentArea.querySelector("h1");
		contentArea.insertBefore(box.cloneNode(true), box);
		contentArea.replaceChild(historybox, box);


		chrome.storage.local.set({'tr' : (new_tr+tr)})

	});







	chrome.storage.local.set({'grades': current_data}, function(){
		console.log("Grade has been updated");
	});

});



// chrome.storage.local.clear()
