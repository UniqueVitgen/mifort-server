const {
  Models
} = require('../sequelize')
const AttachmentWorker = require('../workers/attachment');

const includeArray = [
  {model: Models.Attachment, attributes: ['id', 'filePath', 'attachmentType']},
]

exports.includeInterviewerArray = includeArray;

exports.create_a_interviewer = function(body)  {
      return Models.Interviewer.create(body, {})
};

exports.upload_an_attachment = function(id, file, body) {

  return AttachmentWorker.upload_an_attachment(id, file, body.attachmentType);
}
exports.list_all_interviewers = function () {
  return Models.Interviewer.findAll({include: includeArray});
}
