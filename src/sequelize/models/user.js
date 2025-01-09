/* eslint-disable no-param-reassign */
const { DataTypes } = require('sequelize')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
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
      Comment: ['administrator, approver, user'],
    },
    photo_url: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.STRING,
      allowNull: true,
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
    hooks: {
      beforeValidate: (model) => {
        model.id = uuid.v4()
      },
      beforeCreate: (model, option) => {
        model.password = bcrypt.hashSync(model.password)
        if (option?.req?.user) {
          model.created_by_id = option.req?.user.id
          model.updated_by_id = option.req?.user.id
        }
      },
      beforeUpdate: (model, option) => {
        if (model.changed().length) {
          if (option.req?.user?.id) {
            model.updated_by_id = option.req?.user.id
          }
          if (model.changed().includes('password')) {
            model.password = bcrypt.hashSync(model.password)
          }
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  }
)

module.exports = User
