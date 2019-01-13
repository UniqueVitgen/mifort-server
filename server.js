const Sequelize = require('sequelize')
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
const routesInterviewer = require('./routes/interviewer');
const routesFeedback= require('./routes/feedback');
const routesDevFeedback= require('./routes/dev_feedback');
const routesAttachment= require('./routes/attachment');
const routesPosition= require('./routes/position');
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
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.disable('etag');
// app.disable('etag');


routesCandidate(app);
routesVacancy(app);
routesTeam(app);
routesFeedback(app);
routesDevFeedback(app);
routesInterview(app);
routesInterviewer(app);
routesAttachment(app);
routesPosition(app);
// var routes = require('./routes/candidates'); //importing route
// var routesVacancy = require('./routes/vacancy'); //importing route
// routes(app); //register the route
// routesVacancy(app);

app.listen(PORT);


console.log('todo list RESTful API server started on: ' + PORT);
