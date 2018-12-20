const {
  Models
} = require('../sequelize')
const CandidateWorker = require('../workers/candidate')

const includeArray = [
  {model:Models.Team, as: 'companyName'}
  // Models.Team
]

exports.includeExperienceArray = includeArray;




function createAssociationObject(body) {
  let teamPromise;
  if(body.companyName) {
    teamPromise = Models.Team.findOrCreate({ where: { name: body.companyName.name }, defaults: { name: body.companyName.name }})
                                         .spread((skill, created) => skill);
  }
             return  {
               companyName: teamPromise
             }
}

exports.find_or_create_a_experience = function(body)  {
  // console.log(body);
    const promise = createAssociationObject(body);
    if(promise.companyName) {
    return promise.companyName.then(team => {
      body.companyNameId = team.id;
        // console.log('candidate team', team);
      return Models.Experience.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
        dateTo: body.dateTo, companyNameId: body.companyNameId
      }, include: includeArray})
      .then(candidate => {
        return  Models.Experience.findOne({id: candidate.id})
      .then(candidate =>{ return Models.Experience.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
        dateTo: body.dateTo, companyNameId: body.companyNameId
      }, include: includeArray}
    )})
      .catch(err => {console.error(err);})
      })
    });
    }
    else {
    return Models.Experience.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
      dateTo: body.dateTo
    }, include: includeArray})
    .then(candidate => {
      return  Models.Experience.findOne({id: candidate.id})
    .then(candidate => Models.Experience.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
      dateTo: body.dateTo
    }, include: includeArray}))
    .catch(err => {console.error(err);})
    })
    }
};
