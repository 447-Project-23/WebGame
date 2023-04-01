async function validateSignIn() {
	const userName = document.getElementById("createUserText").value;
	console.log(userName);
	const response = await fetch("http://localhost:9000/users/check", {
		method: "GET",
		mode: "cors",
		params: JSON.stringify(userName),
	});
	console.log(response);
}
