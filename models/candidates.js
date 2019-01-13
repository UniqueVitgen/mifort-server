const Interview = require('./interview');
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
        salaryInDollars: {
          type: type.DECIMAL(65,2),
          validate: {
            min: 0
          }
        }

    },{})

}
