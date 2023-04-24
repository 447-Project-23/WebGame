loadLocalStorage();

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
