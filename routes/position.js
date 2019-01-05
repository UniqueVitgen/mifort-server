module.exports = function(app) {
  var todoList = require('../controllers/position');

  // todoList Routes
  app.route('/position')
    .get(todoList.list_all_positions);
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
