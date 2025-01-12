/* eslint-disable no-param-reassign */
const { DataTypes } = require('sequelize')
const uuid = require('uuid')
const { sequelizeDB, Sequelize } = require('./config')

const Asset = sequelizeDB.define(
  'assets',
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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: Sequelize.STRING(50),
      comment: ['Furniture', 'Elektronik', 'Umum'],
    },
    condition_id: {
      type: Sequelize.STRING(36),
    },
    quantity: {
      type: Sequelize.INTEGER(),
      // unique: true,
    },
    storage_management_id: {
      type: Sequelize.STRING(36),
    },
    // kalau ada logic buat filter unit, baru nyalain
    // unit_id: {
    //   type: Sequelize.STRING(36),
    // },
    is_being_adjusted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
        }
      },
    },
  }
)

module.exports = Asset
