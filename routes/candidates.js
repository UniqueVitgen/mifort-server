
const {
  Models
} = require('../sequelize')

const includeArray = [
  Models.Skill, Models.Responsibility, Models.Attachment, Models.Experience, {model: Models.CandidateState, as: 'candidateState'}
]
  var todoList = require('../controllers/candidates');

module.exports = function(app) {

  // todoList Routes
  app.route('/candidates')
    .get(todoList.list_all_candidates)
    .post(todoList.create_a_candidate);


  app.route('/candidate/:id')
    .get(todoList.read_a_candidate)
    .put(todoList.update_a_candidate)
    .delete(todoList.delete_a_candidate);

app.route('/candidate/:id/timeline')
    .get(todoList.read_timeline)
  // app.route('/vacancy/:id/candidates')
  //   .get(todoList.get_candidates)
};
