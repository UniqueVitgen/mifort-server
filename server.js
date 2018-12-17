var express = require('express');
var bodyParser = require('body-parser');
const CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost/testdb';
const PORT = process.env.PORT || 8081;
var mongoose = require('mongoose');
var cors = require('cors');
const routesCandidate = require('./routes/candidates');
const routesVacancy = require('./routes/vacancy');
const routesTeam = require('./routes/team');
const routesInterview = require('./routes/interview');
const routesFeedback= require('./routes/feedback');
const {
  Models
} = require('./sequelize')

global.__basedir = __dirname;

// Candidate = require('./models/candidates');
// Vacancy = require('./models/vacancy');

var app = express();

// mongoose.Promise = global.Promise;
// mongoose.connect(CONNECT_URI);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


routesCandidate(app);
routesVacancy(app);
routesTeam(app);
routesFeedback(app);
routesInterview(app);
// var routes = require('./routes/candidates'); //importing route
// var routesVacancy = require('./routes/vacancy'); //importing route
// routes(app); //register the route
// routesVacancy(app);

app.listen(PORT);


console.log('todo list RESTful API server started on: ' + PORT);
