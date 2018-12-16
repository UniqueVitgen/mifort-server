const {
  Models
} = require('../sequelize')


const CandidateWorker = require('../workers/candidate');
const {
  includeArrayVacancy
} = require('./vacancy.js')

const includeArray = CandidateWorker.includeCandidateArray;

exports.includeArrayCandidate = includeArray;

exports.list_all_candidates = function (req, res)  {
  CandidateWorker.list_all_candidates().then(candidates => {
      return res.json(candidates);})
      .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.create_a_candidate = function(req, res)  {
  CandidateWorker.create_a_candidate(req.body)
  .then(candidateWithAssociations => {
    return res.json(candidateWithAssociations)
  })
  .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.read_a_candidate = function(req, res)  {
  CandidateWorker.read_a_candidate(req.params.id)
    .then(candidateWithAssociations => {
      return res.json(candidateWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};
exports.read_timeline = function(req, res)  {
  Models.Candidate.findOne({ where: {id: req.params.id}, include: includeArray})
    .then(candidateWithAssociations => {
      let timeline = [];
      timeline = timeline.concat(candidateWithAssociations.attachments);
      if(candidateWithAssociations.experiences) {
        timeline = timeline.concat(candidateWithAssociations.experiences.map(object => {object.type = 'contact'; return object;} ))
      }
      timeline = timeline.sort((a,b) => {
        return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime();
      })
      // return res.json(candidateWithAssociations)
      res.json(timeline);
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_a_candidate = function(req, res) {
  CandidateWorker.update_a_candidate(req.params.id, req.body).then(savedCandidate => {
      res.status(200).send({
        message: 'ok'
      })
    })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
}

exports.delete_a_candidate = function(req, res)  {
  CandidateWorker.delete_a_candidate(req.params.id).then(result => {
    res.status(200).send({
      message: 'OK'
    })
  })
  .catch(err => res.status(400).json({ err: `${err}`}))
}
