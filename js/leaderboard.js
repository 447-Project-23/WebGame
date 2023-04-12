function loadLeaderboard() {
  let s = document.getElementById("leaderboardTable");
  console.log(s.rows[0].cells[0].innerHTML);
  /*
  Row 0 is the table header
  Cell 0 is the user Name
  Cell 1 is the user Level
  Cell 2 is the user Score
  */

  axios.get("http://localhost:9000/users/scores").then((res) => {
    const data = res.data.results;
    const length = data.length;
    for (var i=0; i<10; i++) {
      if (i<length) {
        s.rows[i+1].cells[0].innerHTML = data[i].id;
        s.rows[i+1].cells[1].innerHTML = data[i].level;
        s.rows[i+1].cells[2].innerHTML = data[i].score;
      } else {
        s.rows[i+1].cells[0].innerHTML = "N/A";
        s.rows[i+1].cells[1].innerHTML = "N/A";
        s.rows[i+1].cells[2].innerHTML = "N/A";
      }
    }
		console.log(res.data.results.length);
	}).catch(error => console.log(error));
  return;
}
