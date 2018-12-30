module.exports = (sequelize, type) => {
    return sequelize.define('DevFeedback', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        }
    })
}
