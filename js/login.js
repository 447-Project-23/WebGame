function newUser() {
	var toReturn = {
		id: "",
		level: 0,
		score: 0,
	};
	return toReturn;
}

var userInfo;
loadLocalStorage();
save();

if (!userInfo) {
	userInfo = newUser();
}

function save() {
  localStorage.setItem("webgame", JSON.stringify(userInfo));
}

function loadLocalStorage() {
  userInfo = JSON.parse(localStorage.getItem('webgame'));
}

//This function is used when attempting to sign up for the first time
async function validateSignIn() {
	//Get the username provided
	const userName = document.getElementById("createUserText").value;
	console.log(userName);
	//See if it is a valid attempt (i.e. not empty)
	if (userName.length != 3 || userName != userName.toUpperCase()) {
		//Empty username, so set fields to tell the user it is invalid
		document.getElementById("createUserText").classList.add("is-invalid");
		document.getElementById("invalidCreationText").style.display = "none";
		return;
	} else {
		//Valid username, so remove any fields that say otherwise
		document.getElementById("createUserText").classList.add("is-valid");
		document.getElementById("createUserText").classList.remove("is-invalid");
		document.getElementById("invalidCreationText").style.display = "none";
	}
	//Use the API to see if this username can be used.
	const response = await fetch("http://localhost:9000/users/get/" + userName, {
		method: "GET",
		mode: "cors",
	});
	console.log(await response);
	//Check the API response and determine further steps
	if (!response.ok) {
		console.log("ERROR");
	} else {
		response.json().then(function(data) {
			console.log(data);
			//If data is invalid, then a new user with this name can be created.
			//Else, if the data has some name, then there is already a user with this name
			if (data.id.localeCompare("INVALID") == 0) {
				//New user can be created
				addUser(userName);
			} else {
				//Already a user with this name.
				document.getElementById("invalidCreationText").style.display = "block";
				return;
			}
		});
	}
}

//The user is new, so add to the database
async function addUser(userName) {
	let userObject = {id: userName, level: '0', score: '0'};
	let jsonObject = JSON.stringify(userObject);
	console.log(jsonObject);
	axios.post("http://localhost:9000/users/add/", userObject).then((res) => {
		if (res.status == 200) {
			userInfo.id = userName;
			userInfo.level = 0;
			userInfo.score = 0;
			save();
			document.location.href='\menu.html';
		}
	}).catch(error => console.log(error));

	return;
}

//This function is used when the user tries to log in again
async function validateLogIn() {
	const userName = document.getElementById("loginUserText").value;
	console.log(userName);
	if (userName.length != 3 || userName != userName.toUpperCase()) {
		document.getElementById("loginUserText").classList.add("is-invalid");
		document.getElementById("invalidLoginText").style.display = "none";
		return;
	} else {
		document.getElementById("loginUserText").classList.add("is-valid");
		document.getElementById("loginUserText").classList.remove("is-invalid");
		document.getElementById("invalidLoginText").style.display = "none";
	}
	const response = await fetch("http://localhost:9000/users/get/" + userName, {
		method: "GET",
		mode: "cors",
	});
	console.log(response);
	//Check the API response and determine further steps
	if (!response.ok) {
		console.log("ERROR");
	} else {
		response.json().then(function(data) {
			console.log(data);
			//If data is invalid, then a new user with this name can be created.
			//Else, if the data has some name, then there is already a user with this name
			if (data.id.localeCompare("INVALID") == 0) {
				//New user can be created
				document.getElementById("invalidLoginText").style.display = "block";
			} else {
				//Already a user with this name.
				userInfo.id = userName;
				userInfo.level = data.level;
				userInfo.score = data.score;
				save();
				document.location.href='\menu.html';

				//If we need to use this information elsewhere, we can create global variables
				return;
			}
		});
	}
}
