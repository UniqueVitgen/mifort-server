


var mongoose = require('mongoose'),
Task = mongoose.model('Vacancy');

exports.list_all_candidates = function(req, res) {
  Task.find({}).populate('candidates').exec(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.get_candidates = function(req, res) {
  Task.findOne({_id: req.params.id}).populate('candidates').exec(function(err, vacancy) {
    if (err) {
      res.send(err);
    }
    const candidates = vacancy.candidates;
    res.json(candidates);
  });
}




exports.create_a_candidate = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.read_a_candidate = function(req, res) {
  Task.findById(req.params.id).populate('candidates').exec(function(err, task) {
    if (err) {

    }
      // res.send(err);
    res.json(task);
  });
};


exports.update_a_candidate = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.delete_a_candidate = function(req, res) {


  Task.remove({
    _id: req.params.id
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
