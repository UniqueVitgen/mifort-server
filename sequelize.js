const Sequelize = require('sequelize')
const CandidateModel = require('./models/candidates')
const VacancyModel = require('./models/vacancy')
const SkillModel = require('./models/skill')
const ContactModel = require('./models/contact')
const ResponsibilityModel = require('./models/responsibilities')
const RequirementModel = require('./models/requirement')
const CandidateStateModel = require('./models/candidate-state')
const ProjectModel = require('./models/project')
const TeamModel = require('./models/team')
const ExperienceModel = require('./models/candidate-experience.js')
const AttachmentModel = require('./models/attachment.js')
const InverviewModel = require('./models/inverview.js')

const sequelize = new Sequelize('mifort_server', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// const User = UserModel(sequelize, Sequelize)
// BlogTag will be our way of tracking relationship between Blog and Tag models
// each Blog can have multiple tags and each Tag can have multiple blogs
const CandidateVacancy = sequelize.define('candidate_vacancy', {})
const CandidateResponsibility = sequelize.define('candidate_responsibility', {})
const CandidateSkill = sequelize.define('candidate_skill', {})
const CandidateCandidateState = sequelize.define('candidate_candidate_state', {})
const CandidateExperience = sequelize.define('candidate_experience', {})
const CandidateContact = sequelize.define('candidate_contact', {})
const CandidateAttachment = sequelize.define('candidate_attachment', {})

const VacancySkill = sequelize.define('vacancy_skill', {})
const VacancyRequirements = sequelize.define('vacancy_requirement', {})

const ExperienceTeam = sequelize.define('experience_team', {})
const ExperienceProject = sequelize.define('experience_project', {})

const ProjectTeam = sequelize.define('project_team', {})

const Candidate = CandidateModel(sequelize, Sequelize);
const Vacancy = VacancyModel(sequelize, Sequelize);
const Skill = SkillModel(sequelize, Sequelize)
const Contact = ContactModel(sequelize, Sequelize)
const Responsibility = ResponsibilityModel(sequelize, Sequelize)
const Requirement = RequirementModel(sequelize, Sequelize)
const CandidateState = CandidateStateModel(sequelize, Sequelize)
const Experience = ExperienceModel(sequelize, Sequelize)
const Team = TeamModel(sequelize, Sequelize)
const Project = ProjectModel(sequelize, Sequelize)
const Attachment = AttachmentModel(sequelize, Sequelize)
const Interview = InverviewModel(sequelize, Sequelize)

Candidate.belongsToMany(Vacancy, { through: CandidateVacancy, unique: false })
Vacancy.belongsToMany(Candidate, { through: CandidateVacancy, unique: false })
Candidate.belongsToMany(Responsibility, {through: CandidateResponsibility, unique: false})
Responsibility.belongsToMany(Candidate, {through: CandidateResponsibility, unique: false})
Candidate.belongsToMany(Skill, {through: CandidateSkill, unique: false})
Skill.belongsToMany(Candidate, {through: CandidateSkill, unique: false})
Candidate.belongsToMany(CandidateState, {through: CandidateCandidateState, unique: false})
CandidateState.belongsToMany(Candidate, {through: CandidateCandidateState, unique: false})
Candidate.belongsToMany(Experience, {through: CandidateExperience, unique: false})
Experience.belongsToMany(Candidate, {through: CandidateExperience, unique: false})
Candidate.belongsToMany(Contact, {through: CandidateContact, unique: false})
Contact.belongsToMany(Candidate, {through: CandidateContact, unique: false})
Candidate.belongsToMany(Attachment, {through: CandidateAttachment, unique: false})
Attachment.belongsToMany(Candidate, {through: CandidateAttachment, unique: false})

Contact.belongsTo(Candidate)

Vacancy.belongsToMany(Skill, {through: VacancySkill, unique: false})
Skill.belongsToMany(Vacancy, {through: VacancySkill, unique: false})
Vacancy.belongsToMany(Requirement, {through: VacancyRequirements, unique: false})
Requirement.belongsToMany(Vacancy, {through: VacancyRequirements, unique: false})

Team.belongsToMany(Experience, {through: ExperienceTeam, unique: false})
Experience.belongsToMany(Team, {through: ExperienceTeam, unique: false})
Team.belongsToMany(Project, {through: ProjectTeam, unique: false})
Project.belongsToMany(Team, {through: ProjectTeam, unique: false})

Interview.belongsTo(CandidateVacancy)



sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Candidate,
  Vacancy,
  Skill,
  Interview
}
