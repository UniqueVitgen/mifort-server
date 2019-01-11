module.exports = (sequelize, type) => {
    return sequelize.define('interviewer', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        surname: type.STRING
    })
}
