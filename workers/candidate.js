const {
  Models
} = require('../sequelize')
const CandidateWorker = require('../workers/candidate')

const includeArray = [
  Models.Skill, Models.Responsibility, Models.Attachment, Models.Experience, {model: Models.CandidateState, as: 'candidateState'}, Models.Contact
]


function createAssociationObject(body) {
  let experiences;
  if(body.experiences) {
    experiences = body.experiences.map(skill => Models.Experience.findOrCreate({ where: { jobPosition: skill.jobPosition, dateFrom: skill.dateFrom, dateTo: skill.dateTo }, defaults: { jobPosition: skill.jobPosition }})
                                       .spread((skill, created) => skill));
  }
  let contacts;
  if(body.contacts) {
    contacts = body.contacts.map(skill => Models.Contact.findOrCreate({ where: { contactDetails: skill.contactDetails,  contactType: skill.contactType}, defaults: { contactDetails: skill.contactDetails,  contactType: skill.contactType}})
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
               skills: skills

             }
}

function createAssociations(candidate, promise) {
new Promise((resolve, reject) => {
  if (promise.experiences) {
  return Promise.all(promise.experiences).then(storedExperiences => candidate.setExperiences(storedExperiences))
  .then(() => candidate)
  }
  else {
  return candidate;
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
if(promise.skills) {return Promise.all(promise.skills).then(storedSkills => candidate.setSkills(storedSkills)).then(() => candidate)}
else {return candidate;}
})

}

exports.list_all_candidates = function () {
  return Models.Candidate.findAll({include: includeArray})
}

exports.read_a_candidate = function(id)  {
  return Models.Candidate.findOne({ where: {id: id}, include: includeArray})
};

exports.create_a_candidate = function(body)  {
    const promise = createAssociationObject(body);
    return promise.candidateState.then(candidateState => {
      body.candidateStateId = candidateState.id;
      return Models.Candidate.create(body, {})
      .then((candidate) => {
        return createAssociations(candidate, promise)
      })
      // .then(candidate => Promise.all(promise.experiences).then(storedExperiences => candidate.setExperiences(storedExperiences)).then(() => candidate))
      // .then(candidate => Promise.all(promise.contacts).then(storedContacts => candidate.setContacts(storedContacts)).then(() => candidate))
      // .then(candidate => Promise.all(promise.attachments).then(storedAttachments => candidate.setAttachments(storedAttachments)).then(() => candidate))
      // .then(candidate => Promise.all(promise.responsibilities).then(storedResponsibilities => candidate.setResponsibilities(storedResponsibilities)).then(() => candidate))
      // .then(candidate => Promise.all(promise.skills).then(storedSkills => candidate.setSkills(storedSkills)).then(() => candidate))
      .then(candidate => Models.Candidate.findOne({ where: {id: candidate.id}, include: includeArray}))
      .catch((err) => {
        console.error(err);
      })
  });
};

exports.find_or_create_a_candidate = function(body)  {
  console.log('body', body);
  let experiences;
  if(body.experiences) {
    experiences = body.experiences.map(skill => Models.Experience.findOrCreate({ where: { jobPosition: skill.jobPosition, dateFrom: skill.dateFrom, dateTo: skill.dateTo }, defaults: { jobPosition: skill.jobPosition }})
                                       .spread((skill, created) => skill));
  }
  let contacts;
  if(body.contacts) {
    contacts = body.contacts.map(skill => Models.Contact.findOrCreate({ where: { contactDetails: skill.contactDetails,  contactType: skill.contactType}, defaults: { contactDetails: skill.contactDetails,  contactType: skill.contactType}})
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
  let skills;
  if(body.skills) {
    skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                       .spread((skill, created) => skill))
  }
    return candidateStatePromise.then(candidateState => {
      body.candidateStateId = candidateState.id;
      return Models.Candidate.findOrCreate({where: {name : body.name, surname : body.surname,
        birthday: body.birthday, salaryInDollars: body.salaryInDollars, candidateStateId: body.candidateStateId
      }, include: includeArray})
      .then(candidate => {
        return  Models.Candidate.findOne({id: candidate.id})
      .then(candidate => {
        if (experiences) {
        return Promise.all(experiences).then(storedExperiences => candidate.setExperiences(storedExperiences))
        .then(() => candidate)
      }
    else {
      return candidate;
    }})
      .then(candidate => {
        if(contacts) { return Promise.all(contacts).then(storedContacts => candidate.setContacts(storedContacts)).then(() => candidate) }
      else { return candidate;}
      })
      .then(candidate => {
        if(attachments) {return Promise.all(attachments).then(storedAttachments => candidate.setAttachments(storedAttachments)).then(() => candidate)}
    else {
      return candidate;
    }}
    )
      .then(candidate => {
        if(responsibilities) {return Promise.all(responsibilities).then(storedResponsibilities => candidate.setResponsibilities(storedResponsibilities)).then(() => candidate)}
    else {return candidate;}
  })
      .then(candidate => {
        if(skills) {return Promise.all(skills).then(storedSkills => candidate.setSkills(storedSkills)).then(() => candidate)}
    else {return candidate;}
  })
      .then(candidate => Models.Candidate.findOrCreate({where: {name : body.name, surname : body.surname,
        birthday: body.birthday, salaryInDollars: body.salaryInDollars, candidateStateId: body.candidateStateId
      }, include: includeArray}))
      .catch(err => {console.error(err);})
      })
  });
};


exports.update_a_candidate = function(id, body) {
  const experiences = body.experiences.map(skill => Models.Experience.findOrCreate({ where: { jobPosition: skill.jobPosition, dateFrom: skill.dateFrom, dateTo: skill.dateTo }, defaults: { jobPosition: skill.jobPosition }})
                                       .spread((skill, created) => skill));
  const contacts = body.contacts.map(skill => Models.Contact.findOrCreate({ where: { contactDetails: skill.contactDetails,  contactType: skill.contactType},
    defaults: { contactDetails: skill.contactDetails,  contactType: skill.contactType},
    })
                                       .spread((skill, created) => skill));
  const attachments = body.attachments.map(skill => Models.Attachment.findOrCreate({ where: { filePath: skill.filePath, attachmentType: skill.attachmentType }, defaults: { filePath: skill.filePath, attachmentType: 'CV' }})
                                       .spread((skill, created) => skill));
  const responsibilities = body.responsibilities.map(skill => Models.Responsibility.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                       .spread((skill, created) => skill));
  const candidateStatePromise =
    Models.CandidateState.findOrCreate({ where: { name: body.candidateState.name }, defaults: { name: body.candidateState.name }})
                                         .spread((skill, created) => skill)
  // const skills = body.skills;
  const skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                       .spread((skill, created) => skill))

  return candidateStatePromise.then(candidateState => {
      body.candidateStateId = candidateState.id;
  return Models.Candidate.findOne({id: id})
  .then(candidate => Promise.all(experiences).then(storedExperiences => candidate.setExperiences(storedExperiences)).then(() => candidate))
  .then(candidate => Promise.all(contacts).then(storedExperiences => candidate.setContacts(storedExperiences)).then(() => candidate))
  .then(candidate => Promise.all(skills).then(storedExperiences => candidate.setSkills(storedExperiences)).then(() => candidate))
  .then(candidate => Promise.all(skills).then(storedExperiences => candidate.setSkills(storedExperiences)).then(() => candidate))
  .then(candidate => Models.Candidate.findOne({id: id}))
  .then(candidate => {
    for(let prop in  body) {
      candidate[prop] = body[prop];
    }
      // res.status(200).send({
      //   message: 'ok'
      // })
    return candidate.save({include: includeArray});
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
  })
  })
}

exports.delete_a_candidate = function(id)  {
  return Models.Candidate.findOne({id: id}).then(candidate => {
    return candidate.destroy();
  })
}