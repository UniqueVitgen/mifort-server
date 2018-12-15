module.exports = (sequelize, type) => {
    return sequelize.define('vacancy', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        position: {
          type: type.STRING,
          allowNull: false
        },
        salaryInDollarsFrom: {
          type: type.DECIMAL,
          validate: {
            min: 0
          }
        },
        salaryInDollarsTo: {
          type: type.DECIMAL,
          validate: {
            min: 0
          }
        },
        vacancyState: {
          type: type.ENUM,
          values: ['OPEN', 'CLOSE'],
          allowNull: false,
          defaultValue: 'OPEN'
        },
        experienceYearsRequire: {
          type: type.INTEGER,
          validate: {
            min: 0
          }
        }
    })
}
