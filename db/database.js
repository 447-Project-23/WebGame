var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id varchar,
            level int, 
            score int
            )`,
        (err) => {
            if (err) {
                console.log(err.message)
            }
        });  
    }
});


module.exports = db