module.exports = function(app) {
  var todoList = require('../controllers/candidates');

  // todoList Routes
  app.route('/candidates')
    .get(todoList.list_all_candidates)
    .post(todoList.create_a_candidate);


  app.route('/candidate/:id')
    .get(todoList.read_a_candidate)
    .put(todoList.update_a_candidate)
    .delete(todoList.delete_a_candidate);
};
