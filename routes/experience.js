module.exports = function(app) {
  var todoList = require('../controllers/experience');

  // todoList Routes
  app.route('/experience')
    .get(todoList.list_all_experiences);
  //   .post(todoList.create_a_vacancy);
  //
  //
  // app.route('/vacancy/:id')
  //   .get(todoList.read_a_vacancy)
  //   .put(todoList.update_a_vacancy)
  //   .delete(todoList.delete_a_vacancy);
  //
  // app.route('/vacancy/:id/candidates')
  //   .get(todoList.read_candidates_from_vacancy)
  //   .put(todoList.update_candidates_from_vacancy)
};
