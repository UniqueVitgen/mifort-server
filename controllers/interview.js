const {
  Models
} = require('../sequelize')

const CandidateWorker = require('../workers/candidate')

const includeArray = [
    {model: Models.Candidate, include: {model: Models.CandidateState, as: 'candidateState'}},
    Models.Vacancy
]



exports.list_all_interviews = function (req, res)  {
  Models.Interview.findAll({include: includeArray}).then(interviews => {
      return res.json(interviews);})
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.create_a_interview = function(req, res)  {
  const body = req.body
  //const skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                   //    .spread((skill, created) => skill));
  // const candidatesPromise = body.candidates.map(skill => Models.Candidate.findOrCreate({ where: { name: skill.name, surname: skill.surname }, defaults: { name: skill.name, surname: skill.surname }})
  //                                     .then(candidate => CandidateWorker.read_a_candidate(candidate.id))
  //                                      .spread((skill, created) => skill));
  //const requirementsPromise = body.requirements.map(skill => Models.Requirement.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                      // .spread((skill, created) => skill));
  Models.Interview.create(body, {})
    //.then(interview => Promise.all(skills).then(storedSkills => interview.addSkills(storedSkills)).then(() => interview))
    //.then(interview => Promise.all(candidatesPromise).then(storedSkills => interview.addCandidates(storedSkills)).then(() => interview))
    //.then(interview => Promise.all(requirementsPromise).then(storedSkills => interview.addRequirements(storedSkills)).then(() => interview))
    .then(interview => Models.Interview.findOne({ where: {id: interview.id}, include: includeArray}))
    .then(interviewWithAssociations => {
      return res.json(interviewWithAssociations)
    })
    .catch(err => { console.error(err); res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})})
};

exports.read_a_interview = function(req, res)  {
  Models.Interview.findOne({ where: {id: req.params.id}, include: includeArray})
    .then(interviewWithAssociations => {
      return res.json(interviewWithAssociations)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_a_interview = function(req, res) {
  const body = req.body
  // const candidatesPromise = body.candidates.map(skill => Models.Candidate.findOrCreate({ where: { name: skill.name, surname: skill.surname }, defaults: { name: skill.name, surname: skill.surname }})
  //                                      .spread((skill, created) => skill));
  // const skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
  //                                      .spread((skill, created) => skill));
  // const requirementsPromise = body.requirements.map(skill => Models.Requirement.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
  //                                      .spread((skill, created) => skill));
  Models.Interview.findOne({id: req.params.id})
  // .then(interview => Promise.all(skills).then(storedExperiences => interview.setSkills(storedExperiences)).then(() => interview))
  //   .then(interview => Promise.all(requirementsPromise).then(storedSkills => interview.setRequirements(storedSkills)).then(() => interview))
  //   .then(interview => Promise.all(candidatesPromise).then(storedSkills => interview.setCandidates(storedSkills)).then(() => interview))
  .then(interview => Models.Interview.findOne({id: req.params.id}))
  .then(interview => {
    for(let prop in  body) {
      interview[prop] = body[prop];
    }
    interview.save({include: includeArray}).then(savedInterview => {
      res.status(200).send({
        message: 'ok'
      })
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
  // })
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
