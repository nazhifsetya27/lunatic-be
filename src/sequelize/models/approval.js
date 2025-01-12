/* eslint-disable no-param-reassign */
const { DataTypes } = require('sequelize')
const uuid = require('uuid')
const { sequelizeDB, Sequelize } = require('./config')

const Approval = sequelizeDB.define(
  'approvals',
  {
    id: {
      allowNull: false,
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    stock_adjustment_id: {
      type: DataTypes.STRING(36),
    },
    status: {
      type: DataTypes.STRING,
    },
    requester_id: {
      type: DataTypes.STRING(36),
    },
    approver_id: {
      type: DataTypes.STRING(36),
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
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

module.exports = Approval
