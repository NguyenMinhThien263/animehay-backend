'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Allcodes.belongsToMany(models.Films, {
        through: models.Genries, as:'genreData',
         foreignKey: 'keyMap',
         otherKey:'filmId',
         sourceKey:'keyMap'
      });
      Allcodes.hasOne(models.Films, { foreignKey: 'statusId', as: 'statusData' })
      Allcodes.hasOne(models.Films, { foreignKey: 'releaseDate', as: 'yearData' })
    }
  }
  Allcodes.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcodes',
  });
  return Allcodes;
};