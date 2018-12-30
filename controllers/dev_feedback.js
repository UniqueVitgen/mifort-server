const {
  Models
} = require('../sequelize')


const DevFeedbackWorker = require('../workers/dev_feedback');


exports.create_a_dev_feedback = function(req, res)  {
  DevFeedbackWorker.create_a_dev_feedback(req.body)
  .then(candidateWithAssociations => {
    return res.json(candidateWithAssociations)
  })
  .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_a_dev_feedback = function(req, res) {
  DevFeedbackWorker.update_a_dev_feedback(req.params.id, req.body).then(savedCandidate => {
      res.status(200).send({
        message: 'ok'
      })
    })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
}


exports.list_all_feedbacks = function (req, res) {
  DevFeedbackWorker.list_all_feedbacks().then(resCandidate => {
    res.json(resCandidate);
  })
}

exports.delete_a_dev_feedback = function(req, res)  {
  DevFeedbackWorker.delete_a_dev_feedback(req.params.id).then(result => {
    res.status(200).send({
      message: 'OK'
    })
  })
  .catch(err => res.status(400).json({ err: `${err}`}))
}

exports.read_a_dev_feedback = function(req, res)  {
  DevFeedbackWorker.read_a_dev_feedback(req.params.id)
    .then(candidateWithAssociations => {
      return res.json(candidateWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};
