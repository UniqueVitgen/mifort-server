var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapi';
const port = 8081;

var db = require('./db');
var candidatesController = require('./controllers/candidates');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// parse application/json
//app.use(bodyParser.json())


app.get('/', function(req,res) {
  res.send('Hello Api');
});

app.get('/candidates', candidatesController.all);

app.get('/candidates/:id', candidatesController.findById);

app.post('/candidates', candidatesController.create);

app.put('/candidates/:id', candidatesController.update);

app.delete('/candidates/:id', candidatesController.delete);


db.connect(CONNECT_URI, function(err, database) {
  if(err) {
    return console.log(err);
  }
  app.listen(process.env.PORT || port, function() {
    console.log('API app started')
  });
})
