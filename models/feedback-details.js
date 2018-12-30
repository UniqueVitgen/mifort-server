module.exports = (sequelize, type) => {
    return sequelize.define('feedbackDetails', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        feedbackText: {
          type: type.STRING
        }
    })
}
