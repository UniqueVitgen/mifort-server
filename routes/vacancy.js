module.exports = function(app) {
  var todoList = require('../controllers/vacancy');

  // todoList Routes
  app.route('/vacancies')
    .get(todoList.list_all_candidates)
    .post(todoList.create_a_candidate);


  app.route('/vacancy/:id')
    .get(todoList.read_a_candidate)
    .put(todoList.update_a_candidate)
    .delete(todoList.delete_a_candidate);

  app.route('/vacancy/:id/candidates')
    .get(todoList.get_candidates)
};
