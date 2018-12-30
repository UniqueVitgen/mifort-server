module.exports = (sequelize, type) => {
    return sequelize.define('devFeedback', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        }
    })
}
