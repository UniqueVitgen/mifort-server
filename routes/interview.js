module.exports = function(app) {
    var todoList = require('../controllers/interview');

    // todoList Routes
    app.route('/interviews')
        .get(todoList.list_all_interviews)
        .post(todoList.create_a_interview);


    app.route('/interview/:id')
        .get(todoList.read_a_interview)
        .put(todoList.update_a_interview)
        .delete(todoList.delete_a_interview);

};