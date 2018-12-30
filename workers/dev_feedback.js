const {
  Models
} = require('../sequelize')
const FeedbackDetailsWorker = require('../workers/feedback-details')

const includeArray = [{model:Models.FeedbackState},
  {model:Models.FeedbackDetails, include: FeedbackDetailsWorker.includeFeedbackDetailsArray},
  ]

function createAssociationObject(body) {
  let feedbackDetails;
  let feedbackStatePromise;
  if(body.feedbackDetails) {
    feedbackDetails = body.feedbackDetails.map(skill => FeedbackDetailsWorker.find_or_create_a_feedback_details(skill)
                                       .spread((skill, created) => skill));
  }
  if(body.feedbackState) {
  feedbackStatePromise = Models.FeedbackState.findOrCreate({ where: { name: body.feedbackState.name }, defaults: { name: body.feedbackState.name }})
                                       .spread((skill, created) => skill);
  }
             return  {
               feedbackDetails:  feedbackDetails,
               feedbackState: feedbackStatePromise
             }
}

function createAssociations(candidate, promise) {
  return new Promise((resolveMain, rejectMain) => {
    return new Promise((resolve, reject) => {
      try {
      if (promise.feedbackDetails) {
        return Promise.all(promise.feedbackDetails).then(storedExperiences => candidate.setFeedbackDetails(storedExperiences))
        .then(() => resolve(candidate))
      }
      else {
        resolve(candidate);
      }
  }
  catch(err) {
    reject(err);
  }
})
.then(candidate => {
  resolveMain(candidate);
})
.catch(err => {
  rejectMain(err);
})
})

}

exports.create_a_dev_feedback = function(body)  {
    const promise = createAssociationObject(body);
    return promise.feedbackState.then(feedbackState => {
      body.feedbackStateId = feedbackState.id;
      return Models.DevFeedback.create(body, {})
      .then(feedback => {
        console.log('feedback 1', feedback);
        return createAssociations(feedback, promise).then(feedback => Models.DevFeedback.findOne({ where: {id: feedback.id}, include: includeArray}))
        .catch((err) => {
          console.error(err);
        })
      }).catch((err) => {
        console.error(err);
      })
  });
};

exports.update_a_dev_feedback = function(id, body) {
    const promise = createAssociationObject(body);

    return promise.feedbackState.then(feedbackState => {
      body.feedbackStateId = feedbackState.id;
  return Models.DevFeedback.findOne({where:{id: id}})
  .then(candidate => {
    console.log('candidate.id', candidate.id);
      console.log('id', id);
    if(candidate.id == id) {
    return createAssociations(candidate, promise)
    .then(candidate => Models.DevFeedback.findOne({where: {id: id}}))
    .then(candidate => { if (candidate.id == id) {
        for(let prop in  body) {
            candidate[prop] = body[prop];
        }
        // res.status(200).send({
        //   message: 'ok'
        // })
        return candidate.save({include: includeArray});
    }
     else {
         res.status(404).send({
             message: 'Not found'
         })
    }
    })
    .catch(err => {
      console.log(err);
      //res.status(400).json({ err: `User with id = [${err}] doesn\'t exist.`})
    })
    }
    })
  })
}

exports.list_all_feedbacks = function () {
  return Models.DevFeedback.findAll({include: includeArray});
}

exports.delete_a_dev_feedback = function(id)  {
  return Models.DevFeedback.findOne({where: {id: id}}).then(candidate => {
      if (candidate.id == id) {return candidate.destroy();}
  })
}
exports.read_a_dev_feedback = function(id)  {
  return Models.DevFeedback.findOne({ where: {id: id}, include: includeArray})
};
exports.read_a_dev_feedback_by_interview = function(id)  {
  return Models.DevFeedback.findOne({ where: {interviewId: id}, include: includeArray})
};
