module.exports = function(app) {
  var todoList = require('../controllers/team');

  // todoList Routes
  app.route('/team')
    .get(todoList.list_all_teams);
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
