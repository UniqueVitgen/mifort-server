const Sequelize = require('sequelize')
const CandidateModel = require('./models/candidates')
const VacancyModel = require('./models/vacancy')
const SkillModel = require('./models/skill')
const ContactModel = require('./models/contact')
const ResponsibilityModel = require('./models/responsibilities')
const RequirementModel = require('./models/requirement')
const CandidateStateModel = require('./models/candidate-state')

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

const VacancySkill = sequelize.define('vacancy_skill', {})
const VacancyRequirements = sequelize.define('vacancy_requirement')

const Candidate = CandidateModel(sequelize, Sequelize);
const Vacancy = VacancyModel(sequelize, Sequelize);
const Skill = SkillModel(sequelize, Sequelize)
const Contact = ContactModel(sequelize, Sequelize)
const Responsibility = ResponsibilityModel(sequelize, Sequelize)
const Requirement = RequirementModel(sequelize, Sequelize)
const CandidateState = CandidateStateModel(sequelize, Sequelize)

Candidate.belongsToMany(Vacancy, { through: CandidateVacancy, unique: false })
Vacancy.belongsToMany(Candidate, { through: CandidateVacancy, unique: false })
Candidate.belongsToMany(Responsibility, {through: CandidateResponsibility, unique: false})
Responsibility.belongsToMany(Candidate, {through: CandidateResponsibility, unique: false})
Candidate.belongsToMany(Skill, {through: CandidateSkill, unique: false})
Skill.belongsToMany(Candidate, {through: CandidateSkill, unique: false})
Candidate.belongsToMany(CandidateState, {through: CandidateCandidateState, unique: false})
CandidateState.belongsToMany(Candidate, {through: CandidateCandidateState, unique: false})

Vacancy.belongsToMany(Skill, {through: VacancySkill, unique: false})
Skill.belongsToMany(Vacancy, {through: VacancySkill, unique: false})
Vacancy.belongsToMany(Requirement, {through: VacancyRequirements, unique: false})
Requirement.belongsToMany(Vacancy, {through: VacancyRequirements, unique: false})

Contact.belongsTo(Candidate)


sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Candidate,
  Vacancy,
  Skill
}
