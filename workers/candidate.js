const {
  Models
} = require('../sequelize')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CandidateWorker = require('../workers/candidate')
const InterviewWorker = require('../workers/interview')
const ExperienceWorker = require('../workers/experience')
const VacancyController = require('../controllers/vacancy')

const includeArray = [
  Models.Skill, Models.Responsibility,
  {model: Models.Attachment, attributes: ['id', 'filePath', 'attachmentType']},
  {model:Models.Experience, include: ExperienceWorker.includeExperienceArray},
  {model: Models.CandidateState, as: 'candidateState'},
  Models.Contact,
  Models.Position
]

const includeArrayWithFiles  = [
  Models.Skill, Models.Responsibility, {model: Models.Attachment}, {model:Models.Experience, include: ExperienceWorker.includeExperienceArray}, {model: Models.CandidateState, as: 'candidateState'}, Models.Contact
]

const includeArrayWithInterview = includeArray.concat([
  {model: Models.Interview,
  where: {
    planDate: {
      [Op.gt]: new Date()
    }
  }, required: false}
])

const includeArrayVacancy = [
  {model: Models.Vacancy, include: VacancyController.includeArrayVacancy
  }
]
const orderArrayCandidate = [
  ['id', 'asc'],
  [Models.Attachment, 'id', 'asc']
]
const orderArrayCandidateWithInterview = orderArrayCandidate.concat([
  [Models.Interview, 'planDate', 'ASC']
])

exports.includeCandidateArray = includeArray;
exports.includeCandidateArrayWithFiles = includeArrayWithFiles;
exports.includeCandidateArrayWithInterview = includeArrayWithInterview;

exports.orderArrayCandidateWithInterview = orderArrayCandidateWithInterview;

function createAssociationObject(body) {
  let experiences;
  if(body.experiences) {
    experiences = body.experiences.map(skill => ExperienceWorker.find_or_create_a_experience(skill)
                                       .spread((skill, created) => skill));
  }
  let contacts;
  if(body.contacts) {
    contacts = body.contacts.map(skill => Models.Contact.findOrCreate({ where: { contactDetails: skill.contactDetails,  contactType: skill.contactType, preferred: skill.preferred}, defaults: { contactDetails: skill.contactDetails,  contactType: skill.contactType, preferred: skill.preferred}})
                                       .spread((skill, created) => skill));
  }
  let attachments;
  if(body.attachments) {
  attachments = body.attachments.map(skill => Models.Attachment.findOrCreate({ where: { filePath: skill.filePath, attachmentType: skill.attachmentType }, defaults: { filePath: skill.filePath, attachmentType: 'CV' }})
                                     .spread((skill, created) => skill));
  }
  // if(body.attachments)

  // }
  let responsibilities;
  if(body.responsibilities) {
    responsibilities = body.responsibilities.map(skill => Models.Responsibility.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                       .spread((skill, created) => skill));
  }
  let candidateStatePromise;
  if(body.candidateState) {
    candidateStatePromise = Models.CandidateState.findOrCreate({ where: { name: body.candidateState.name }, defaults: { name: body.candidateState.name }})
                                         .spread((skill, created) => skill);
  }
  let positionPromise;
  if(body.position) {
    positionPromise = Models.Position.findOrCreate({ where: { name: body.position.name }, defaults: { name: body.position.name }})
                                         .spread((skill, created) => skill);
  }
  let skills;
  if(body.skills) {
    skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                       .spread((skill, created) => skill))
  }
             return  {
               experiences: experiences,
               contacts: contacts,
               attachments: attachments,
               responsibilities: responsibilities,
               candidateState: candidateStatePromise,
               position: positionPromise,
               skills: skills

             }
}

function createSingleAssociations(body, promise) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve2, reject2) => {
      promise.candidateState.then(candidateState => {
        body.candidateStateId = candidateState.id;
        resolve2(body);
      })
    })
    .then(body => {
      if(promise.position) {
      return promise.position.then(position => {
        body.positionId = position.id;
        return body;
      })
    }else {
      return body;
    }
    })
    .then(body => {
      resolve(body)
    })
  })
}

function createAssociations(candidate, promise) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve, reject) => {
      if (promise.experiences) {
        return Promise.all(promise.experiences).then(storedExperiences => candidate.setExperiences(storedExperiences))
        .then(() => resolve(candidate))
      }
      else {
        resolve(candidate);
  }
})
.then(candidate => {
if(promise.contacts) { return Promise.all(promise.contacts).then(storedContacts => candidate.setContacts(storedContacts)).then(() => candidate) }
else { return candidate;}
})
.then(candidate => {
if(promise.attachments) {return Promise.all(promise.attachments).then(storedAttachments => candidate.setAttachments(storedAttachments)).then(() => candidate)}
else {
return candidate;
}}
)
.then(candidate => {
if(promise.responsibilities) {return Promise.all(promise.responsibilities).then(storedResponsibilities => candidate.setResponsibilities(storedResponsibilities)).then(() => candidate)}
else {return candidate;}
})
.then(candidate => {
if(promise.skills) {return Promise.all(promise.skills).then(storedSkills => candidate.setSkills(storedSkills)).then(() => resolve(candidate))}
else {resolve(candidate);}
})
.catch(err => {
  console.error(err);
})
})

}

exports.list_all_candidates = function () {
  return Models.Candidate.findAll({include: includeArrayWithInterview, order: orderArrayCandidateWithInterview})
}

exports.read_a_candidate = function(id)  {
  return Models.Candidate.findOne({ where: {id: id}, include: includeArray, order: orderArrayCandidate})
};

exports.read_vacancies = function(id)  {
  return Models.Candidate.findOne({ where: {id: id}, include: includeArrayVacancy}).then(candidate => {
    return candidate.vacancies;
  })
};

exports.create_a_candidate = function(body)  {
    const promise = createAssociationObject(body);
    return createSingleAssociations(body, promise)
      .then(body => {
      return Models.Candidate.create(body, {})
      .then(candidate => {
        console.log('candidate 1', candidate);
        return createAssociations(candidate, promise).then(candidate => Models.Candidate.findOne({ where: {id: candidate.id}, include: includeArray}))
        .catch((err) => {
          console.error(err);
        })
      }).catch((err) => {
        console.error(err);
      })
  });
};

exports.find_or_create_a_candidate = function(body)  {
    const promise = createAssociationObject(body);
    if(body.id == null) {
    return createSingleAssociations(body, promise)
      .then(body => {
      return Models.Candidate.findOrCreate({where: {name : body.name, surname : body.surname,
        birthday: body.birthday, salaryInDollars: body.salaryInDollars, candidateStateId: body.candidateStateId
      }, include: includeArray})
      .then(candidate => {
        return  Models.Candidate.findOne({id: candidate.id})
      })
      .then(candidate => {
        if(candidate.id)
        return createAssociations(candidate, promise)
        .then(candidate => Models.Candidate.findOrCreate({where: {name : body.name, surname : body.surname,
          birthday: body.birthday, salaryInDollars: body.salaryInDollars, candidateStateId: body.candidateStateId
        }, include: includeArray, order: orderArrayCandidate}))
        .catch(err => {console.error(err);})
        })
      })
    }
    else {
      return Models.Candidate.findOrCreate({where: {id: body.id}, include: includeArray, order: orderArrayCandidate})
    }
};


exports.update_a_candidate = function(id, body) {
    const promise = createAssociationObject(body);

    return createSingleAssociations(body, promise)
      .then(body => {
  return Models.Candidate.findOne({where:{id: id}})
  .then(candidate => {
    console.log('candidate.id', candidate.id);
      console.log('id', id);
    if(candidate.id == id) {
    return createAssociations(candidate, promise)
    .then(candidate => Models.Candidate.findOne({where: {id: id}}))
    .then(candidate => { if (candidate.id == id) {
        for(let prop in  body) {
            candidate[prop] = body[prop];
        }
        // res.status(200).send({
        //   message: 'ok'
        // })
        return candidate.save({include: includeArray});
    }
     else {
         res.status(404).send({
             message: 'Not found'
         })
    }
    })
    .catch(err => {
      console.log(err);
      //res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
    })
    }
    })
  })
}

exports.delete_a_candidate = function(id)  {
  return Models.Candidate.findOne({where: {id: id}}).then(candidate => {
      if (candidate.id == id) {return candidate.destroy();}
  })
}
