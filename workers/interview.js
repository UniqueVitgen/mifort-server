const {
  Models
} = require('../sequelize')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.get_all_interviews_by_candidate = function(id) {
  return Models.Interview.findAll({
    where: {
      candidateId: id,
      planDate: {
        [Op.gt]: new Date()
      }
    },
    order: [
      ['planDate', 'ASC']
    ]
  }).then(interviews => {
    return interviews;
  })
}
