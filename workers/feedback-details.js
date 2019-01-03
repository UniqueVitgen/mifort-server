const {
  Models
} = require('../sequelize')

const includeArray = [{model: Models.Requirement}]

exports.includeFeedbackDetailsArray = includeArray;

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

exports.find_or_create_a_feedback_details = function(body)  {
    const promise = createAssociationObject(body);
    // if(body.id == null) {
    // console.log('body', body);
    // return Models.findOne()
      return Models.FeedbackDetails.findOrCreate({where: { requirementId : body.requirementId,
        devFeedbackId: body.devFeedbackId
      }, include: includeArray})
      .spread(feedbackDetails => {
        // console.log('feedbackDetails', feedbackDetails.get());
        return feedbackDetails.get();
      })
      .then(feedbackDetails => {
        return Models.FeedbackDetails.findOne({where: {id: feedbackDetails.id},include: includeArray})
      })
      .then(feedbackDetails => {
        feedbackDetails.feedbackText = body.feedbackText;
        return feedbackDetails.save({include: includeArray})
      })
      .then(feedbackDetails => {
        // console.log('feedbackDetails after save', feedbackDetails);
        return Models.FeedbackDetails.findOrCreate({where: { requirementId : body.requirementId,
          devFeedbackId: body.devFeedbackId
        }, include: includeArray})
      });
      // .then(feedbackDetails => {
      //   console.log('feedbackDetails 1', feedbackDetails.feedbackText);
      //   feedbackDetails.feedbackText = body.feedbackDetails;
      //   return feedbackDetails.save({include: includeArray})
      // })
      // .then(feedbackDetails => Models.FeedbackDetails.findOrCreate({where:{id: feedbackDetails.id}}))
      // .then(candidate => {
      //   return  Models.Candidate.findOne({id: candidate.id})
      // })
      // .then(candidate => {
      //   return createAssociations(candidate, promise)
      //   .then(candidate => Models.Candidate.findOrCreate({where: {feedbackText : body.feedbackText, requirementId : body.requirementId,
      //     devFeedbackId: body.devFeedbackId
      //   }, include: includeArray}))
      //   .catch(err => {console.error(err);})
      //   })
      // })
    // }
    // else {
    //   return Models.FeedbackDetails.findOrCreate({where: {id: body.id}, include: includeArray})
    // }
};
