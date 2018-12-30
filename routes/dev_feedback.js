// todoList Routes
  var todoList = require('../controllers/dev_feedback');
module.exports = function(app) {
app.route('/dev_feedback')
  .get(todoList.list_all_feedbacks)
  .post(todoList.create_a_dev_feedback);

//
//
app.route('/dev_feedback/:id')
  .get(todoList.read_a_dev_feedback)
  .put(todoList.update_a_dev_feedback)
  .delete(todoList.delete_a_dev_feedback);
}
