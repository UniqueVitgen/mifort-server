module.exports = function(app) {
  var todoList = require('../controllers/feedback');

  // todoList Routes
  app.route('/feedback')
    .get(todoList.list_all_feedbacks)
    .post(todoList.create_a_feedback);
  //
  //
  app.route('/feedback/:id')
    .get(todoList.read_a_feedback)
    .put(todoList.update_a_feedback)
    .delete(todoList.delete_a_feedback);
  //
  // app.route('/vacancy/:id/candidates')
  //   .get(todoList.read_candidates_from_vacancy)
  //   .put(todoList.update_candidates_from_vacancy)
};
