const {
  Models
} = require('../sequelize')
const ExperienceWorker = require('../workers/experience')

exports.list_all_experiences = function (req, res)  {
  ExperienceWorker.list_all_experiences().then(candidates => {
      return res.json(candidates);
    });
};
