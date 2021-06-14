'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.follow, {
        as: 'follower',
        foreignKey: {
          name: 'followerId'
        }
      })
      user.hasMany(models.follow, {
        as: 'following',
        foreignKey: {
          name: 'followingId'
        }
      })
      user.hasMany(models.feed, {
        as: 'feed',
        foreignKey: {
          name: 'userId'
        }
      })
      user.hasMany(models.comment, {
        as: 'comment',
        foreignKey: {
          name: 'userId'
        }
      })
    }
  };
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};