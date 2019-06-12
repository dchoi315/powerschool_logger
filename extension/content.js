function extractNumberGrade(str){
	var s = "";
	for(var i = 0; i < str.length; i++){
		if(str[i] >= '0' && str[i] <= '9' || str[i] == '.') s += str[i];
		
	}
	if(s == "--" || s == "[ i ]") return "N";
	return parseFloat(s);
}

function classData(){
	src = document.documentElement.outerHTML;
	var classes = document.querySelectorAll('tr[id^="ccid"]');


	var data = []

	for(var i = 0; i < classes.length; i++){
		var class_data = classes.item(i).querySelector('td[align="left"]');

		name = class_data.textContent.substring(0,class_data.textContent.indexOf("Details" , 0))
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
	var current_data = classData()
	
	if(key.grades !== undefined){
		// previous_data = key.grades
		previous_data = [
			["AP Micro Economics ", 95.8, 94.1, 95.2, 95.4],
			["IB Literature_Language I HL ", 95.9, 93.6, 98.4, 95.4],
			["AP Calculus AB ", 97.5, 93.9, 98.5, 96.6],
			["Adv Topics Comp Science ", 98.3, 96.3, 93, 95.7],
			["Physics ", 95, 99.1, 94.9, 96.3],
			["Simulations and Num Models ", "N", 95, "N", "N"],
			["IB Hist of Amer I HL ", 94.2, 93.9, 92.2, 93.4],
			["IB Espanol IV SL ", 96.1, 95.4, 92.1, 94.5],
			["Structured Query Lang ", "N", 98.6, "N", "N"],
			["Artificial Intelligence ", "N", "N", 91.8, "N"]
		]
		console.log(current_data)  
		console.log(previous_data)

		// Subject - Current - Previous - Change - DateUpdated

		changes = []
	
		for (subject = 0; subject < current_data.length; subject++){
			for (section = 1; section < current_data[subject].length; section++){
				
				// console.log(previous_data[subject][section] != current_data[subject][section])
				if (previous_data[subject][section] != current_data[subject][section]){
					

					console.log(previous_data[subject][section])
					subject = current_data[subject][0];
					before = previous_data[subject][section];
					after = current_data[subject][section];
					change = current_data[subject][section]-=previous_data[subject][section];

					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();

					today = mm + '/' + dd + '/' + yyyy;

					changelog = subject + ':' + before + ":" + after + ":" + change + ":" + today;

					console.log(changelog)
				}
			}
		}

	} else{
		console.log("First Scraping")
	}

	
	chrome.storage.local.set({'grades': current_data});
});




// chrome.storage.local.clear(function() {
// 	console.log("Cleared")
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });