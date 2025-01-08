const User = require('./user')
const Building = require('./building')
const Floor = require('./floor')
const Room = require('./room')
const Asset = require('./asset')
const Condition = require('./condition')
const Unit = require('./unit')
const StorageManagement = require('./storage_management')
const StockAdjustment = require('./stock_adjustment')
const StockAdjustmentInventory = require('./stock_adjustment_inventory')

const initRelationships = require('./config/relationship')

const models = {
  User,
  Building,
  Floor,
  Room,
  Asset,
  Condition,
  Unit,
  StorageManagement,
  StockAdjustment,
  StockAdjustmentInventory,
}

initRelationships(models)

exports.Models = models
