
const upload = require('../config/upload.js');
module.exports = function(app) {
    var todoList = require('../controllers/interviewer');

    // todoList Routes
    app.route('/interviewers')
        .get(todoList.list_all_interviewers)
        .post(todoList.create_a_interviewer);

    app.route('/interviewer/:id/uploadAttachment')
          .post(upload.single("file"), todoList.upload_an_attachment)

    // app.route('/interview/:id')
    //     .get(todoList.read_a_interview)
    //     .put(todoList.update_a_interview)
    //     .delete(todoList.delete_a_interview);

};
