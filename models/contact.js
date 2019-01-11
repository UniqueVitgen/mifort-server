module.exports = (sequelize, type) => {
    return sequelize.define('contact', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        contactType: {
          type: type.ENUM,
          values: [ 'EMAIL', 'PHONE', 'SKYPE']
        },
        contactDetails: {
          type: type.STRING
        },
        preferred: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    })
}
