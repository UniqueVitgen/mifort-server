module.exports = (sequelize, type) => {
    return sequelize.define('FeedbackDetails', {
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
