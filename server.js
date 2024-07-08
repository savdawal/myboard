const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:1234@cluster0.0fn1ffc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


let mydb;

MongoClient.connect(url)
    .then(client => {
        mydb = client.db('myboard');  // Corrected this line
        mydb.collection('post').find().toArray().then(result => {
            console.log(result);
        });
    })
    .catch(err => {
        console.log(err);
    });

var mysql = require("mysql2");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "myboard"
});

conn.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + conn.threadId);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To handle form submissions

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/list', function(req, res) {
    // conn.query('SELECT * FROM post', function(err, rows, fields) {
    //     if (err) throw err;
    //     console.log(rows);
    //     res.json(rows);  // Send the rows as a JSON response
    // });
    mydb.collection('post').find().toArray(function(err, result){
        console.log(result);
    })
    //res.sendFile(__dirname + '/list.ejs');
    res.render('list.ejs');
});

app.get('/enter', function(req, res){
    res.sendFile(__dirname + '/enter.html');
});

app.post('/save', function(req, res){
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.profile_id);

    mydb.collection('post').insertOne(
        {title: req.body.title, content: req.body.content}
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공')
    });

    let sql = 'INSERT INTO post (title, content, profile_id, created) VALUES (?, ?, ?, NOW())';
    let params = [req.body.title, req.body.content, req.body.profile_id];
    conn.query(sql, params, function (err, result) {
        if (err) throw err;
        console.log('데이터 추가 성공');
        res.send('데이터 추가 성공');
    });
});

// Start the server
const PORT = 8081;
app.listen(PORT, function() {
    console.log(`Server listening on port ${PORT}...`);
});

