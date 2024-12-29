/* eslint-disable no-param-reassign */
const { DataTypes } = require('sequelize')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const { sequelizeDB, Sequelize } = require('./config')

const Unit = sequelizeDB.define(
  'units',
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
    kode: {
      type: Sequelize.STRING(50),
      unique: true,
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
  }
)

module.exports = Unit