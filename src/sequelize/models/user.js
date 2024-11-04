const { DataTypes } = require('sequelize')
const { sequelizeDB, Sequelize } = require('./config')

const User = sequelizeDB.define(
  'users',
  {
    id: {
      allowNull: false,
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.TEXT,
    },
    role: {
      type: Sequelize.TEXT,
      Comment: 'administrator, approver, user',
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
)

module.exports = User
