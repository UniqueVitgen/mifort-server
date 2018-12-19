const AttachmentWorker = require('../workers/attachment')

exports.downloadFile = function(req, res) {
  AttachmentWorker.downloadFile(req.params.id, res);
}
