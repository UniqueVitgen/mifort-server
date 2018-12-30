module.exports = (sequelize, type) => {
    return sequelize.define('feedback', {
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
