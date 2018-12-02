var Candidates = require('../models/candidates.js');
var bodyParser = require('body-parser');

exports.all = function(req, res) {
  Candidates.all(function(err, docs) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.send(docs);
  })
}

exports.findById = function(req, res) {
  Candidates.findById(req.params.id, function(err, doc) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.send(doc);
  })
}

exports.create = function(req, res) {
  console.log(req.body);
  var artist = {
  "name": req.body.name,
  "surname": req.body.surname,
  "birthday": req.body.birthday,
  "salaryInDollars": req.body.salaryInDollars,
  "candidateState": req.body.candidateState,
  "skills": req.body.skills,
  "experiences": req.body.experiences,
  "contacts": req.body.contacts,
  "attachments": req.body.attachments,
  "responsibilities": req.body.responsibilities
}
  Candidates.create(artist, function(err, result) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.send(artist);
  })
}

exports.update = function(req, res) {
  Candidates.update(req.params.id,
    {
    "name": req.body.name,
    "surname": req.body.surname,
    "birthday": req.body.birthday,
    "salaryInDollars": req.body.salaryInDollars,
    "candidateState": req.body.candidateState,
    "skills": req.body.skills,
    "experiences": req.body.experiences,
    "contacts": req.body.contacts,
    "attachments": req.body.attachments,
    "responsibilities": req.responsibilities
  },
    function(err, result) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
}

exports.delete = function(req, res) {
  Candidates.delete(req.params.id, function(err,result) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
}
