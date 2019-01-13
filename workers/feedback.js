const {
  Models
} = require('../sequelize')

const includeArray = [Models.Candidate]

function createAssociationObject(body) {
  let candidateStatePromise;
  if(body.feedbackState) {
  candidateStatePromise = Models.FeedbackState.findOrCreate({ where: { name: body.feedbackState.name }, defaults: { name: body.feedbackState.name }})
                                       .spread((skill, created) => skill);
  }
             return  {
               feedbackState: candidateStatePromise

             }
}

exports.list_all_feedbacks = function () {
  return Models.Feedback.findAll({include: includeArray});
}

exports.create_a_feedback = function (body) {
    return Models.Feedback.create(body, {include: includeArray});
}

exports.read_a_feedback = function(id)  {
  return Models.Feedback.findOne({ where: {id: id}, include: includeArray})
};

exports.delete_a_feedback = function(id)  {
  return Models.Feedback.findOne({where: {id: id}}).then(candidate => {
    if(candidate.id == id) {
    return candidate.destroy();
    }
  })
}

exports.update_a_feedback = function (id, body) {
  const promiseObject = createAssociationObject(body);
        return Models.Feedback.findOne({where: {id: id}, include: includeArray})  .then(candidate => {
            for(let prop in  body) {
              candidate[prop] = body[prop];
            }
              // res.status(200).send({
              //   message: 'ok'
              // })
            return candidate.save({include: includeArray});
          })
          .catch(err => {
            console.log(err);
            //res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
          })
}
