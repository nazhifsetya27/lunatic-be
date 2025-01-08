/* eslint-disable no-param-reassign */
const uuid = require('uuid')
const { sequelizeDB, Sequelize } = require('./config')

const StockAdjustmentInventory = sequelizeDB.define(
  'stock_adjustment_inventories',
  {
    id: {
      allowNull: false,
      type: Sequelize.STRING(36),
      primaryKey: true,
    },
    stock_adjustment_id: {
      type: Sequelize.STRING(36),
    },
    asset_id: {
      type: Sequelize.STRING(36),
    },
    previous_condition_id: {
      type: Sequelize.STRING(36),
    },
    current_condition_id: {
      type: Sequelize.STRING(36),
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
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

module.exports = StockAdjustmentInventory
