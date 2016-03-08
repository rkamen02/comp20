// parse function. grabs data from lab.js, parses data, then sends data to messages id
function parse(){
	var file2 = "https://messagehub.herokuapp.com/messages.json"
	var file1 = "data.json"
	var req = new XMLHttpRequest();
	var data;
	var result = "";

	req.open("GET", file2, true);

	req.onreadystatechange = function(){
		if (req.readyState == 4){
			data = JSON.parse(req.responseText);
			for (var i = 0; i < data.length; i++){
				result += data[i]["content"] + " " + data[i]["username"] + "<br>";
			}

			var messages = document.getElementById("messages");
			messages.innerHTML = result;
		}

	}

	req.send(null);


}