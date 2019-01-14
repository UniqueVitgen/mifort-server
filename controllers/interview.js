const {
  Models
} = require('../sequelize')

const CandidateWorker = require('../workers/candidate')
const InterviewWorker = require('../workers/interview')
const InterviewerWorker = require('../workers/interviewer')
const VacancyController = require('../controllers/vacancy')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const includeArray = [
    {model: Models.Candidate, include: CandidateWorker.includeCandidateArray},
    {model: Models.Vacancy, include: VacancyController.includeArrayVacancy},
    {model: Models.Interviewer, include: [{model:Models.Attachment, attributes: ['id', 'filePath', 'attachmentType']}]}
]
const orderArray = [
  ['id', 'desc'],
  [Models.Vacancy, Models.Requirement, 'public', 'desc'],
  [Models.Vacancy, Models.Requirement, 'required', 'desc']
]

exports.includeArray = includeArray;

function createAssociationObject(body) {
  let interviewers;
  if(body.interviewers) {
    interviewers = body.interviewers.map(skill => Models.Interviewer.findOrCreate({where: {name: skill.name, surname: skill.surname, id: skill.id}})
                                       .spread((skill, created) => skill));
  }
             return  {
               interviewers: interviewers,

             }
}

function createAssociations(candidate, promise) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      if (promise.interviewers) {
        return Promise.all(promise.interviewers).then(storedExperiences => candidate.setInterviewers(storedExperiences))
        .then(() => resolve(candidate))
        .catch((err) => {console.error(err);})
      }
      else {
        resolve(candidate);
  }
})
.then(candidate => {
  resolve(candidate);
})
.catch(err => {
  console.error(err);
})
})

}




exports.list_all_interviews = function (req, res)  {
  Models.Interview.findAll({include: includeArray, order: orderArray}).then(interviews => {
      return res.json(interviews);})
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.create_a_interview = function(req, res)  {
  const body = req.body;
  const promise = createAssociationObject(body);
  Models.Interview.create(body, {})
    .then(interview => {
      return createAssociations(interview, promise)
      .then(interview => Models.Interview.findOne({ where: {id: interview.id}, include: includeArray, order: orderArray}))
      .then(interviewWithAssociations => {
        return res.json(interviewWithAssociations)
      })
    })
    .catch(err => { console.error(err); res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})})
};

exports.read_a_interview = function(req, res)  {
  Models.Interview.findOne({ where: {id: req.params.id}, include: includeArray,
  order: orderArray})
    .then(interviewWithAssociations => {
      return res.json(interviewWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_a_interview = function(req, res) {
  const body = req.body
  const promise = createAssociationObject(body);
   Models.Interview.findOne({where: {id: req.params.id}})
  .then(interview => { if (interview.id == req.params.id) {
    return createAssociations(interview, promise).then(interview => {
      for(let prop in  body) {
          interview[prop] = body[prop];
      }
      return interview.save({include: includeArray}).then(savedInterview => {
          res.status(200).send({
              message: 'ok'
          })
      });
    })
  }
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
  // })
}


exports.get_all_interviews_by_candidate = function(req,res) {
  InterviewWorker.get_all_interviews_by_candidate(req.params.id)
  .then(interviews => {
    res.json(interviews);
  })
}

exports.delete_a_interview = function(req, res)  {
    Models.Interview.findOne({where: {id: req.params.id}}).then(interview => { if (interview.id == req.params.id) {
        interview.destroy().then(result => {
            res.status(200).send({
                message: 'OK'
            })
        })
            .catch(err => res.status(400).json({ err: `${err}`}))
    }
    else {
        res.status(200).send({
            message: 'not found'
        })
    }
    })
        .catch(err => res.status(400).json({ err: `${err}`}))

}
