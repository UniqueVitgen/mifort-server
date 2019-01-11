
const InterviewerWorker = require('../workers/interviewer');
const AttachmentWorker = require('../workers/attachment');

exports.create_a_interviewer = function(req, res)  {
  InterviewerWorker.create_a_interviewer(req.body)
  .then(candidateWithAssociations => {
    return res.json(candidateWithAssociations)
  })
  .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};

exports.upload_an_attachment = function(req, res) {

  AttachmentWorker.upload_an_attachment_to_interviewer(req.params.id, req.file, req.body.attachmentType).then(attachment => {
    res.json(attachment);
  })
}
exports.list_all_interviewers = function (req, res)  {
  return InterviewerWorker.list_all_interviewers().then(candidates => {
      return res.json(candidates);})
      .catch(err => res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`}))
};
