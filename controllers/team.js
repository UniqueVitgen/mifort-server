const {
  Models
} = require('../sequelize')
const TeamWorker = require('../workers/team')

exports.list_all_teams = function (req, res)  {
  TeamWorker.list_all_teams().then(candidates => {
      return res.json(candidates);
    });
};
