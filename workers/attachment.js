const {
  Models
} = require('../sequelize')
const CandidateWorker = require('../workers/candidate');

const includeArray = [
  Models.Candidate
]


function createAssociationObject(body) {
  let candidatesPromise;
  if(body.candidates) {
    candidatesPromise = body.candidates.map(skill => CandidateWorker.find_or_create_a_candidate(skill)
                         .spread((skill, created) => skill));
                       }
  return {
    candidates: candidatesPromise
  }
}

function createAssociations(attachment, promise) {
  return new Promise((resolve, reject) => {
    if(promise.candidates) { return Promise.all(promise.candidates).then(storedSkills => {console.log(storedSkills); return attachment.setCandidates(storedSkills)}).then(() => resolve(attachment)) }
    else { resolve(attachment);}
  })
}

exports.upload_an_attachment = function(id, file, attachmentType) {
  return Models.Candidate.findOne({where: {id: id}, include: CandidateWorker.includeCandidateArray}).then(candidate => {
    console.log('candidate', attachmentType);
    body = {
      candidates: [candidate.dataValues]
    }
    const promise = createAssociationObject(body)
      return Models.Attachment.create({
          filePath: file.path,
          attachmentType: attachmentType
        })
        .then(attachment => {
          return createAssociations(attachment, promise).then((attachment => {
            // console.log(attachment);
            return attachment;
          }));
        })
        .catch(err => {
          console.error(err);
        })
      })
      .catch(err => {
        console.error(err);
      });
}