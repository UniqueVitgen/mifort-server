const {
  Models
} = require('../sequelize')
const CandidateWorker = require('../workers/candidate');
var stream = require('stream');
const fs = require('fs');

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
    console.log('file', file);
    body = {
      candidates: [candidate.dataValues]
    }
    const promise = createAssociationObject(body)
      return Models.Attachment.create({
          filePath: file.path,
          attachmentType: attachmentType,
		      data: fs.readFileSync(file.path)
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


exports.downloadFile = (id, res) => {
	Models.Attachment.findOne({where: {id: id}}).then(file => {
    console.log('file', file);
		var fileContents = Buffer.from(file.data, "base64");
		var readStream = new stream.PassThrough();
		readStream.end(fileContents);

		res.set('Content-disposition', 'attachment; filename=' + file.name);
		res.set('Content-Type', file.type);

		readStream.pipe(res);
	})
}
