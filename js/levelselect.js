loadLocalStorage();
//Update the information again here just in case [also used specifically if the player lost on endless mode]
//If we try to update on endless mode, it causes lots of bugs, so we do it here instead, as the level does not need changing
updateUserInfoLevel(userInfo.id, userInfo.level, userInfo.score);
function updateUserInfoLevel(userName, curLevel, curScore) {
	let userObject = {id: userName, level: curLevel, score: curScore};
	axios.put("http://localhost:9000/users/update/" + userName, userObject).then((res) => {
		if (res.status == 200) {
			console.log("Update successful")
		}
	}).catch(error => console.log(error));
}


function loadLevelSelect() {
  document.getElementById("level1").classList.remove("disabled");
  if (userInfo.level >= 1) {
    document.getElementById("level2").classList.remove("disabled");
    if (userInfo.level >= 2) {
      document.getElementById("level3").classList.remove("disabled");
      if (userInfo.level >= 3) {
        document.getElementById("level4").classList.remove("disabled");
      }
    }
  }
}

function selectLevel1() {
  userInfo.currentLevel = 1;
  save();
  document.location.href='\game.html';
}

function selectLevel2() {
  userInfo.currentLevel = 2;
  save();
  document.location.href='\game.html';
}

function selectLevel3() {
  userInfo.currentLevel = 3;
  save();
  document.location.href='\game.html';
}

function selectLevel4() {
  userInfo.currentLevel = 4;
  save();
  document.location.href='\game.html';
}
