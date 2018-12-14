
const {
  Models
} = require('../sequelize')

module.exports = function(app) {

  app.post('/candidates', (req, res) => {
    const body = req.body
    const experiences = body.experiences.map(skill => Models.Experience.findOrCreate({ where: { jobPosition: skill.jobPosition, dateFrom: skill.dateFrom, dateTo: skill.dateTo }, defaults: { jobPosition: skill.jobPosition }})
                                         .spread((skill, created) => skill));
    const contacts = body.contacts.map(skill => Models.Contact.findOrCreate({ where: { contactDetails: skill.contactDetails,  contactType: skill.contactType}, defaults: { contactDetails: skill.contactDetails,  contactType: skill.contactType}})
                                         .spread((skill, created) => skill));
    const attachments = body.attachments.map(skill => Models.Attachment.findOrCreate({ where: { filePath: skill.filePath, attachmentType: skill.attachmentType }, defaults: { filePath: skill.filePath, attachmentType: 'CV' }})
                                         .spread((skill, created) => skill));
    const responsibilities = body.responsibilities.map(skill => Models.Responsibility.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                         .spread((skill, created) => skill));
    const candateState = body.candidateState;
    const skills = body.skills.map(skill => Models.Skill.findOrCreate({ where: { name: skill.name }, defaults: { name: skill.name }})
                                         .spread((skill, created) => skill))
      // const tags = body.tags.map(tag => Tag.findOrCreate({ where: { name: tag.name }, defaults: { name: tag.name }})
      //                                      .spread((tag, created) => tag));
    Models.Candidate.create(body)
    .then(candidate => Promise.all(experiences).then(storedExperiences => candidate.addExperiences(storedExperiences)).then(() => candidate))
    .then(candidate => Promise.all(contacts).then(storedContacts => candidate.addContacts(storedContacts)).then(() => candidate))
    .then(candidate => Promise.all(attachments).then(storedAttachments => candidate.addAttachments(storedAttachments)).then(() => candidate))
    .then(candidate => Promise.all(responsibilities).then(storedResponsibilities => candidate.addResponsibilities(storedResponsibilities)).then(() => candidate))
      .then(candidate => Promise.all(skills).then(storedSkills => candidate.addSkills(storedSkills)).then(() => candidate))
      .then(candidate => Models.Candidate.findOne({ where: {id: candidate.id}, include: [Models.Skill, Models.Responsibility, Models.Attachment, Models.Experience]}))
      .then(candidateWithAssociations => {
        return res.json(candidateWithAssociations)
      })
      .catch(err => res.status(400).json({ err: `User with id = [${body.userId}] doesn\'t exist.`}))
      // .then((candidate) => {
      //   Promise.all(experiences).then(StoredExperiences => {
      //     console.log(StoredExperiences);
      //     candidate.addExperiences(StoredExperiences);
      //   })
      // })
  })
};
