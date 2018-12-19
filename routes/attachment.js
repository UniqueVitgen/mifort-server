

  var todoList = require('../controllers/attachment');
module.exports = function(app) {


app.route('/attachment/:id')
  .get(todoList.downloadFile)
// app.route('/vacancy/:id/candidates')
//   .get(todoList.get_candidates)
};
