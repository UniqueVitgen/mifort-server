const {
  Models
} = require('../sequelize')


const CandidateWorker = require('../workers/candidate');
const AttachmentWorker = require('../workers/attachment');
const DevFeedbackWorker = require('../workers/dev_feedback');
const {
  includeArrayVacancy
} = require('./vacancy.js')

const includeArray = CandidateWorker.includeCandidateArray;
const includeArrayWithFiles = CandidateWorker.includeCandidateArrayWithFiles;

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

exports.read_vacancies = function(req, res)  {
  CandidateWorker.read_vacancies(req.params.id)
    .then(candidateWithAssociations => {
      return res.json(candidateWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
}

exports.read_timeline = function(req, res)  {
  Models.Candidate.findOne({ where: {id: req.params.id}, include: includeArrayWithFiles})
    .then(candidateWithAssociations => {
      let timeline = [];
      if(candidateWithAssociations.attachments) {
      timeline = timeline.concat(candidateWithAssociations.attachments);
      }
      if(candidateWithAssociations.experiences) {
        timeline = timeline.concat(candidateWithAssociations.experiences.map(object => {object.type = 'contact'; return object;} ))
      }

      return Models.Feedback.findAll({where:{candidateId: req.params.id}})
      .then((feedbacks) => {
        timeline = timeline.concat(feedbacks);
        // return res.json(candidateWithAssociations)

        return Models.Interview.findAll( {where: {candidateId: req.params.id}})
            .then(interviews => {
                if (interviews) {
                    timeline = timeline.concat(interviews);
                }
                return Models.DevFeedback.findAll({where: {candidateId: req.params.id}, include: DevFeedbackWorker.includeDevFeedbackArray})
                .then(devFeedbacks => {
                  if(devFeedbacks) {
                      timeline = timeline.concat(devFeedbacks);
                  }
                  timeline = timeline.sort((a,b) => {
                      return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime();
                    })
                    console.log('timeine', timeline);
                    // return res.json(candidateWithAssociations)
                  res.json(timeline);
                })
        })
      })

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

exports.upload_an_attachment = function(req, res) {

  AttachmentWorker.upload_an_attachment(req.params.id, req.file, req.body.attachmentType).then(attachment => {
    res.json(attachment);
  })
}
