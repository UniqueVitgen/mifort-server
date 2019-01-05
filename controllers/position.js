const {
  Models
} = require('../sequelize')
const PositionWorker = require('../workers/position')

exports.list_all_positions = function (req, res)  {
  PositionWorker.list_all_positions().then(candidates => {
      return res.json(candidates);
    });
};
