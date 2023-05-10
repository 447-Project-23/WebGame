// CMSC 447 Group L
// Database implementation with express

var express = require("express")
var app = express()
var db = require('./database.js')
var bodyParser = require("body-parser");
var cors = require("cors");
var axios = require("axios");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// port and show running
var HTTP_PORT = 9000 
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// ROOT
// proof that you can make a connection into the DB
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// /USERS/DUMP
// will dump the entirety of the database in raw
// json format, useful probably for debugging
app.get("/users/dump", (req, res, next) => {
    let query = "select * from users"
    let result = [];
    db.all(query, result, (err, sql) => {
        if (err)
        {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({"users":sql})
    })
})

// /USERS/SCORES
// will give the top 10 (if 10 exist) 
// in order from highest scorer to lowest of the 10
app.get("/users/scores", (req, res, next) => {
    let query = "select * from users order by score desc limit 10"
    let result = [];
    db.all(query, result, (err, sql) => {
        if (err)
        {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({"results":sql})
    })
})

// /USERS/ADD
// adds a user to the database by a POST request
// as this sits right now, it will do no filtering
// so it will allow multiple users with the same ID
// can address later
app.post("/users/add", (req, res, next) => {
    let errors = [];
    if (!req.body.id) {
        errors.push("no id")
    }
    if (!req.body.level) {
        errors.push("no level")
    }
    if (!req.body.score) {
        errors.push("no score")
    }
    if (errors.length > 0) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    let data = {
        id: req.body.id,
        level: req.body.level,
        score: req.body.score
    }
    let query = "insert into users (id,level,score) VALUES (?,?,?)"
    let params = [data.id, data.level, data.score]
    db.run(query, params, (err, result) => {
        if (err)
        {
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({"message":"user successfully added"})
    })
})

// /USERS/GET/:id
// gets a certain user by their id returning a json object
// request @ get("http://localhost:9000/users/get/{ID}")
app.get("/users/get/:id", (req, res, next) => {
    let query = "SELECT * FROM users WHERE id=?"
    let params = [req.params.id]
    db.get(query, params, (err, sql) => {
        if (err)
        {
            res.status(400).json({"error":err.message})
            return;
        }
        console.log(sql)
        if (!sql  || sql == {})
        {
            sql = {"id":"INVALID", "level":0, "score":0}
        }
        res.json(sql)
    })
})

// /USERS/UPDATE/:id
// updates a certain user, takes their ID, level, and score to be updated
app.put("/users/update/:id", (req, res, next) => {
    let errors = [];
    if (!req.body.level)
    {
        errors.push("no level")
    }
    if (!req.body.score)
    {
        errors.push("no score")
    }

    if (errors.length > 0)
    {
        res.status(400).json({"error":errors.join(",")})
        return;
    }

    let query = "UPDATE users set level=?, score=? where id=?"
    let params = [req.body.level, req.body.score, req.body.id]

    db.run(query, params, (err, sql) => {
        if (err)
        {
            res.status(400).json({"error":err.message})
            return;
        }
        res.json({"message":"success"})
    })
})

// /API/SEND
// sending a get to this route will get the top 5 scores and send them to prof allgood's API
app.get("/api/send", (req, res, next) => {
    let query = "SELECT id, score FROM users ORDER BY score DESC LIMIT 5";
    let end_result = {"data":[{"Group":"L","Title":"Top 5 Scores"}]}
    db.all(query, [], (err, sql) => {
        if (err)
        {
            console.log("Failed to query top 5 scores from DB", err)
            return;
        }
        sql.forEach(user => {
            end_result["data"][0][user["id"]] = user["score"]
        })
        
        axios.post("https://eope3o6d7z7e2cc.m.pipedream.net", end_result)
        .then((res) => {console.log("Success sending to API"); console.log(res)})
        .catch((err) => {console.log("Something went wrong sending to API"); console.log(err)})
        res.json({"message":"success"})
    })
})