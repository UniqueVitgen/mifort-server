module.exports = (sequelize, type) => {
    return sequelize.define('project', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        dateFrom: {
          type: type.DATE,
          allowNull: false
        },
        dateTo: {
          type: type.DATE,
          allowNull: false
        }

    })
}
