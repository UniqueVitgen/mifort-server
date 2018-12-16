const {
  Models
} = require('../sequelize')

const CandidateController = require('./candidates.js')
const CandidateWorker = require('../workers/candidate')
const includeArrayCandidate = CandidateController.includeArrayCandidate
const includeArray = [
  Models.Skill,
  Models.Requirement,
  {model:Models.Candidate,
    include: [Models.Skill, Models.Responsibility, Models.Attachment, Models.Experience, {model: Models.CandidateState, as: 'candidateState'}, Models.Contact]}
]

exports.includeArrayVacancy = includeArray;

exports.list_all_vacancies = function (req, res)  {
  Models.Vacancy.findAll({include: includeArray}).then(vacancies => {
      return res.json(vacancies);})
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};


function createAssociationObject(body) {
            let skills;
            if(body.skills) {
              skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                     .spread((skill, created) => skill));
            }
            let candidatesPromise;
            if(body.candidates) {
              candidatesPromise = body.candidates.map(skill => CandidateWorker.find_or_create_a_candidate(skill)
                                     .spread((skill, created) => skill));
            }
            let requirementsPromise;
            if(body.requirements) {
             requirementsPromise = body.requirements.map(skill => Models.Requirement.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                     .spread((skill, created) => skill));
            }
             return  {
               skills: skills,
               candidates: candidatesPromise,
               requirements: requirementsPromise
             }
}

function createAssociations(vacancy, promise) {
 new Promise((resolve, reject) => {
  if (promise.skills) {
    console.log('vacancy', vacancy);
    console.log('vacancy atta1', vacancy);
    // resolve(vacancy);
    Promise.all(promise.skills).then(storedExperiences => vacancy.setSkills(storedExperiences))
    .then(() => resolve(vacancy))
  }
  else {
    resolve(vacancy);
  }
})

}

exports.create_a_vacancy = function(req, res)  {
  const body = req.body
  const promise = createAssociationObject(body);
  Models.Vacancy.create(body, {})
    .then(vacancy => {
      if(promise.skills) {
        return Promise.all(promise.skills).then(storedExperiences => vacancy.setSkills(storedExperiences))
          .then(() => vacancy)
      }
      else {return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta2', vacancy);
      if(promise.candidates) { return Promise.all(promise.candidates).then(storedSkills => {console.log(storedSkills); return vacancy.setCandidates(storedSkills)}).then(() => vacancy) }
      else { return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta3', vacancy);
      if(promise.attachments) {return Promise.all(promise.requirements).then(storedSkills => vacancy.setRequirements(storedSkills)).then(() => vacancy)}
      else {
        return vacancy;
      }
    })
    .then(vacancy => {console.log('');console.log('findOne');console.log(''); return Models.Vacancy.findOne({ where: {id: vacancy.id}, include: includeArray})})
    .then(vacancyWithAssociations => {
      return res.json(vacancyWithAssociations)
    })
    .catch(err => {
      console.error('err -',err);
      res.status(400).json({ err: `create vacancy error = [${err}] doesn\'t exist.`})}
  )
};

exports.read_a_vacancy = function(req, res)  {
  Models.Vacancy.findOne({ where: {id: req.params.id}, include: includeArray})
    .then(vacancyWithAssociations => {
      return res.json(vacancyWithAssociations)
        // return res.json(includeArrayCandidate)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.read_candidates_from_vacancy = function(req, res)  {
  Models.Vacancy.findOne({ where: {id: req.params.id}, include: includeArray})
    .then(vacancyWithAssociations => {
      return res.json(vacancyWithAssociations.candidates)
    })
    .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.update_candidates_from_vacancy = function(req, res)  {
  const body = req.body
  const promise = createAssociationObject(body);

  Models.Vacancy.findOne({where:{id: req.params.id}, include: includeArrayCandidate})
    .then(vacancy => {
      if(promise.skills) {
        return Promise.all(promise.skills).then(storedExperiences => vacancy.setSkills(storedExperiences))
          .then(() => vacancy)
      }
      else {return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta2', vacancy);
      if(promise.candidates) { return Promise.all(promise.candidates).then(storedSkills => {console.log(storedSkills); return vacancy.setCandidates(storedSkills)}).then(() => vacancy) }
      else { return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta3', vacancy);
      if(promise.attachments) {return Promise.all(promise.requirements).then(storedSkills => vacancy.setRequirements(storedSkills)).then(() => vacancy)}
      else {
        return vacancy;
      }
    })
  .then(vacancy => Models.Vacancy.findOne({id: req.params.id}))
  .then(vacancy => {
    vacancy.save({include: includeArray}).then(savedVacancy => {
      res.status(200).send({
        message: 'OK'
      })
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
};

exports.update_a_vacancy = function(req, res) {
  const body = req.body
  const promise = createAssociationObject(body);
  Models.Vacancy.findOne({id: req.params.id})
    .then(vacancy => {
      if(promise.skills) {
        return Promise.all(promise.skills).then(storedExperiences => vacancy.setSkills(storedExperiences))
          .then(() => vacancy)
      }
      else {return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta2', vacancy);
      if(promise.candidates) { return Promise.all(promise.candidates).then(storedSkills => {console.log(storedSkills); return vacancy.setCandidates(storedSkills)}).then(() => vacancy) }
      else { return vacancy;}
    })
    .then(vacancy => {
      console.log('vacancy atta3', vacancy);
      if(promise.attachments) {return Promise.all(promise.requirements).then(storedSkills => vacancy.setRequirements(storedSkills)).then(() => vacancy)}
      else {
        return vacancy;
      }
    })
  .then(vacancy => Models.Vacancy.findOne({id: req.params.id}))
  .then(vacancy => {
    for(let prop in  body) {
      vacancy[prop] = body[prop];
    }
    vacancy.save({include: includeArray}).then(savedVacancy => {
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

exports.delete_a_vacancy = function(req, res)  {
  Models.Vacancy.findOne({where: {id: req.params.id}}).then(vacancy => { if (vacancy.id == req.params.id) {
    vacancy.destroy().then(result => {
      res.status(200).send({
        message: 'OK',
          id : vacancy.id,
          req: req.params.id
      })
    })
    .catch(err => res.status(400).json({ err: `${err}`}))
  }
  else {
      res.status(200).send({
          message: 'not found',
          id : vacancy.id,
          req: req.params.id
      })
  }
  })
  .catch(err => res.status(400).json({ err: `${err}`}))

}
