const {
  Models
} = require('../sequelize')


exports.list_all_teams = function () {
  return Models.Team.findAll();
}
