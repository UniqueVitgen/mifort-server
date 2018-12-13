module.exports = (sequelize, type) => {
    return sequelize.define('attachment', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        attachmentType: {
          type: type.ENUM,
          allowNull: false,
          values: [ 'CV', 'COVER_LETTER', 'PHOTO' ]
        },
        filePath: {
          type: type.STRING,
          allowNull: false
        }

    })
}
