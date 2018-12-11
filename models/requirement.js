module.exports = (sequelize, type) => {
    return sequelize.define('requirement', {
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
        }
    })
}
