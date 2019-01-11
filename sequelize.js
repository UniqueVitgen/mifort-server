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
const InterviewerModel = require('./models/interviewer.js')
const InterviewModel = require('./models/interview.js')
const DevFeedbackModel = require('./models/dev-feedback.js')
const FeedbackDetailsModel = require('./models/feedback-details.js')
const FeedbackModel = require('./models/feedback.js')
const FeedbackStateModel = require('./models/feedback-state.js')
const PositionModel = require('./models/position.js')

const sequelize = new Sequelize('mifort_server', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // disable logging; default: console.log
  logging: false
})

// const User = UserModel(sequelize, Sequelize)
// BlogTag will be our way of tracking relationship between Blog and Tag models
// each Blog can have multiple tags and each Tag can have multiple blogs
const CandidateVacancy = sequelize.define('candidate_vacancy', {})
const CandidateResponsibility = sequelize.define('candidate_responsibility', {})
const CandidateSkill = sequelize.define('candidate_skill', {})
const CandidateExperience = sequelize.define('candidate_experience', {})
const CandidateContact = sequelize.define('candidate_contact', {})
const CandidateAttachment = sequelize.define('candidate_attachment', {})

const VacancySkill = sequelize.define('vacancy_skill', {})
const VacancyRequirements = sequelize.define('vacancy_requirement', {})

// const ExperienceTeam = sequelize.define('experience_team', {})
// const ExperienceProject = sequelize.define('experience_project', {})

const ProjectTeam = sequelize.define('project_team', {})

const InterviewInterviewer = sequelize.define('interview_Interviewer')

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

const Interview = InterviewModel(sequelize, Sequelize)
const Interviewer = InterviewerModel(sequelize, Sequelize)
const Feedback = FeedbackModel(sequelize, Sequelize)
const FeedbackState = FeedbackStateModel(sequelize, Sequelize)
const DevFeedback = DevFeedbackModel(sequelize, Sequelize)
const FeedbackDetails = FeedbackDetailsModel(sequelize, Sequelize)
const Position = PositionModel(sequelize, Sequelize)

Candidate.belongsToMany(Vacancy, { through: CandidateVacancy, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE', underscore: false }, {underscored: false})
Vacancy.belongsToMany(Candidate, { through: CandidateVacancy, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Candidate.belongsToMany(Responsibility, {through: CandidateResponsibility, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Responsibility.belongsToMany(Candidate, {through: CandidateResponsibility, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Candidate.belongsToMany(Skill, {through: CandidateSkill, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Skill.belongsToMany(Candidate, {through: CandidateSkill, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Candidate.belongsToMany(Experience, {through: CandidateExperience, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Experience.belongsToMany(Candidate, {through: CandidateExperience, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Candidate.belongsToMany(Contact, {through: CandidateContact, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Contact.belongsToMany(Candidate, {through: CandidateContact, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Candidate.belongsToMany(Attachment, {through: CandidateAttachment, unique: false, onDelete:'CASCADE', onUpdate: 'CASCADE'})
Attachment.belongsToMany(Candidate, {through: CandidateAttachment, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})

Contact.belongsTo(Candidate)

Vacancy.belongsToMany(Skill, {through: VacancySkill, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Skill.belongsToMany(Vacancy, {through: VacancySkill, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Vacancy.belongsToMany(Requirement, {through: VacancyRequirements, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Requirement.belongsToMany(Vacancy, {through: VacancyRequirements, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Vacancy.belongsTo(Position)

Interview.belongsToMany(Interviewer, {through: InterviewInterviewer, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Interviewer.belongsToMany(Interview, {through: InterviewInterviewer, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Interviewer.hasOne(Attachment);

Experience.belongsTo(Team, {as: 'companyName'})
Experience.belongsTo(Project);
Experience.belongsTo(Position, {as: 'jobPosition'});

// Interview.belongsTo(CandidateVacancy, {underscore: true})
// Interview.belongsToMany(Candidate, {through: InterviewCandidate, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
// Candidate.belongsToMany(Interview, {through: InterviewCandidate, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
// Interview.belongsToMany(Vacancy, {through: InterviewVacancy, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
// Vacancy.belongsToMany(Interview, {through: InterviewVacancy, unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})

Interview.belongsTo(Candidate, {unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
Interview.belongsTo(Vacancy, {unique: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'})

Candidate.hasMany(Interview);
Candidate.belongsTo(CandidateState, {as: 'candidateState'})
Candidate.belongsTo(Position)

Feedback.belongsTo(Candidate)
Feedback.belongsTo(FeedbackState);

DevFeedback.belongsTo(Interview);
DevFeedback.belongsTo(Candidate)
DevFeedback.belongsTo(FeedbackState);

FeedbackDetails.belongsTo(DevFeedback);
DevFeedback.hasMany(FeedbackDetails);
FeedbackDetails.belongsTo(Requirement);


sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  });

Models = {
  Candidate: Candidate,
  Vacancy: Vacancy,
  Skill: Skill,
  Contact: Contact,
  Responsibility: Responsibility,
  Requirement: Requirement,
  CandidateState: CandidateState,
  Experience: Experience,
  Team: Team,
  Project: Project,
  Attachment: Attachment,
  Interview: Interview,
  Interviewer: Interviewer,
  Feedback: Feedback,
  FeedbackState: FeedbackState,
  DevFeedback: DevFeedback,
  FeedbackDetails: FeedbackDetails,
  Position: Position
}

module.exports = {
  Models
}
