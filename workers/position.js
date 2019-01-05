const {
  Models
} = require('../sequelize')
const includeArray = [
  // {model:Models.Team, as: 'companyName'},
  // {model:Models.Position, as:'jobPosition'}
  // Models.Team
]
exports.list_all_positions = function () {
  return Models.Position.findAll({include: includeArray})
}
