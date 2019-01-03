module.exports = (sequelize, type) => {
    return sequelize.define('candidate', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        surname: type.STRING,
        birthday: type.DATE,
        position: type.STRING,
        salaryInDollars: {
          type: type.DECIMAL,
          validate: {
            min: 0
          }
        }

    }, {
      })
}
