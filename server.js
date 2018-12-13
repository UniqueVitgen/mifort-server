var express = require('express');
var bodyParser = require('body-parser');
const CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost/testdb';
const PORT = process.env.PORT || 8081;
var mongoose = require('mongoose');
var cors = require('cors');
const { Candidate, Vacancy, Skill } = require('./sequelize')

// Candidate = require('./models/candidates');
// Vacancy = require('./models/vacancy');

var app = express();

// mongoose.Promise = global.Promise;
// mongoose.connect(CONNECT_URI);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.post('/candidates', (req, res) => {
  const body = req.body
  const experiences = body.experiences;
  const contacts = body.contacts;
  const attachments = body.attachments;
  const responsibilities = body.responsibilities;
  const candateState = body.candidateState;
  const skills = body.skills;
  Candidate.create(body)
    .then((candidate) => {
      Promise.all(skills).then(StoredSkills => {
        console.log(StoredSkills);
        candidate.addSkills(StoredSkills).then(() => skill);
      })
    })
    .then(candidate => Candidate.findOne({ where: {id: candidate.id}, include: [Skill]}))
    // .then((candidate) => {
    //   Promise.all(experiences).then(StoredExperiences => {
    //     console.log(StoredExperiences);
    //     candidate.addExperiences(StoredExperiences);
    //   })
    // })
    .then(candidate => {
      res.json(candidate);
    })
})
// var routes = require('./routes/candidates'); //importing route
// var routesVacancy = require('./routes/vacancy'); //importing route
// routes(app); //register the route
// routesVacancy(app);

app.listen(PORT);


console.log('todo list RESTful API server started on: ' + PORT);
