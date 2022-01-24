'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class marsImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  marsImage.init({
    catID: DataTypes.STRING,
    imageSorce: DataTypes.STRING,
    earthDate: DataTypes.STRING,
    solDate: DataTypes.STRING,
    roger: DataTypes.STRING,
    camera: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'marsImage',
  });
  return marsImage;
};