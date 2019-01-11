module.exports = (sequelize, type) => {
    return sequelize.define('interview', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        planDate: {
          type: type.DATE,
          allowNull: false
        },
        planEndDate: {
          type: type.DATE,
          allowNull: false,
        },
        completed: {
          type: type.BOOLEAN,
          defaultValue: false
        }
    })
}
