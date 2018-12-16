const {
  Models
} = require('../sequelize')


const FeedbackWorker = require('../workers/feedback');


exports.create_a_feedback = function(req, res)  {
  FeedbackWorker.create_a_feedback(req.body)
  .then(candidateWithAssociations => {
    return res.json(candidateWithAssociations)
  })
  .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};


exports.list_all_feedbacks = function (req, res) {
  FeedbackWorker.list_all_feedbacks().then(resCandidate => {
    res.json(resCandidate);
  })
}

exports.read_a_feedback = function(req, res)  {
  FeedbackWorker.read_a_feedback(req.params.id)
    .then(candidateWithAssociations => {
      return res.json(candidateWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_a_feedback = function(req, res) {
  FeedbackWorker.update_a_feedback(req.params.id, req.body).then(savedCandidate => {
      res.status(200).send({
        message: 'ok'
      })
    })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
}

exports.delete_a_feedback = function(req, res)  {
  FeedbackWorker.delete_a_feedback(req.params.id).then(result => {
    res.status(200).send({
      message: 'OK'
    })
  })
  .catch(err => res.status(400).json({ err: `${err}`}))
}
