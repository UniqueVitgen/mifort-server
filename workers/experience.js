const {
  Models
} = require('../sequelize')
const CandidateWorker = require('../workers/candidate')

const includeArray = [
  {model:Models.Team, as: 'companyName'},
  {model:Models.Position, as:'jobPosition'}
  // Models.Team
]

exports.includeExperienceArray = includeArray;




function createAssociationObject(body) {
  let teamPromise;
  if(body.companyName) {
    teamPromise = Models.Team.findOrCreate({ where: { name: body.companyName.name }, defaults: { name: body.companyName.name }})
                                         .spread((skill, created) => skill);
  }
    let jobPosition;
    if(body.jobPosition) {
      jobPosition = Models.Position.findOrCreate({ where: { name: body.jobPosition.name }, defaults: { name: body.jobPosition.name }})
                                           .spread((skill, created) => skill);
    }
             return  {
               companyName: teamPromise,
               jobPosition: jobPosition
             }
}

function createSingleAssociations(body, promise) {
  return new Promise((resolve, reject) => {
    return new Promise((resolve2, reject2) => {
      promise.companyName.then(companyName => {
        body.companyNameId = companyName.id;
        resolve2(body);
      })
    })
    .then(body => {
      if(promise.jobPosition) {
      return promise.jobPosition.then(jobPosition => {
        body.jobPositionId = jobPosition.id;
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

exports.find_or_create_a_experience = function(body)  {
  // console.log(body);
    const promise = createAssociationObject(body);
    if(promise.companyName) {
    return promise.companyName.then(team => {
      body.companyNameId = team.id;
      return promise.jobPosition.then(jobPosition => {
        body.jobPositionId = jobPosition.id;
        // console.log('candidate team', team);
      return Models.Experience.findOrCreate({where: { dateFrom : body.dateFrom,
        dateTo: body.dateTo, companyNameId: body.companyNameId, jobPositionId: body.jobPositionId
      }, include: includeArray})
      .then(candidate => {
        return  Models.Experience.findOne({id: candidate.id})
        })
      .then(candidate =>{ return Models.Experience.findOrCreate({where: { dateFrom : body.dateFrom,
        dateTo: body.dateTo, companyNameId: body.companyNameId, jobPositionId: body.jobPositionId
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


exports.list_all_experiences = function () {
  return Models.Experience.findAll({include: includeArray})
}
