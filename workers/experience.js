
const CandidateWorker = require('../workers/candidate')

const includeArray = [
  Models.Team
]




function createAssociationObject(body) {
  let teamPromise;
  if(body.team) {
    teamPromise = Models.Team.findOrCreate({ where: { name: body.team.name }, defaults: { name: body.team.name }})
                                         .spread((skill, created) => skill);
  }
             return  {
               team: teamPromise
             }
}

exports.find_or_create_a_experience = function(body)  {
    const promise = createAssociationObject(body);
    return promise.team.then(team => {
      body.teamId = team.id;
      return Models.Experience.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
        dateTo: body.dateTo
      }, include: includeArray})
      .then(candidate => {
        return  Models.Experience.findOne({id: candidate.id})
      .then(candidate => Models.Candidate.findOrCreate({where: {jobPosition : body.jobPosition, dateFrom : body.dateFrom,
        dateTo: body.dateTo
      }, include: includeArray}))
      .catch(err => {console.error(err);})
      })
  });
};
