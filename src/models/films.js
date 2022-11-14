'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Films.belongsToMany(models.Allcodes, {
        through: models.Genries, as:'genreData', 
        foreignKey: 'filmId',
        otherKey:'keyMap',
        sourceKey:'id'
      })
      Films.belongsTo(models.Allcodes, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' })
      Films.belongsTo(models.Allcodes, { foreignKey: 'releaseDate', targetKey: 'keyMap', as: 'yearData' })
    }
  }
  Films.init({
    title: DataTypes.STRING,
    subTitle: DataTypes.STRING,
    statusId: DataTypes.STRING,
    scrores: DataTypes.STRING,
    releaseDate: DataTypes.STRING,
    totalEpisode: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.BLOB,
  }, {
    sequelize,
    modelName: 'Films',
  });
  return Films;
};