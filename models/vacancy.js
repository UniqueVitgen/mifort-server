module.exports = (sequelize, type) => {
    return sequelize.define('vacancy', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        description: {
            type: type.TEXT
        },
        salaryInDollarsFrom: {
          type: type.DECIMAL(65,2),
          validate: {
            min: 0
          }
        },
        salaryInDollarsTo: {
          type: type.DECIMAL(65,2),
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
