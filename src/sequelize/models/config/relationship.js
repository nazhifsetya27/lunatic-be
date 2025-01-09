// const Unit = require("../unit")

module.exports = (models) => {
  const {
    User,
    Floor,
    Building,
    Room,
    Asset,
    StorageManagement,
    Unit,
    Condition,
    StockAdjustment,
    StockAdjustmentInventory,
  } = models

  Floor.belongsTo(Building, {
    foreignKey: 'gedung_id',
    as: 'building',
  })

  Building.hasMany(Floor, {
    foreignKey: 'gedung_id',
    as: 'building',
  })

  Asset.belongsTo(StorageManagement, {
    foreignKey: 'storage_management_id',
    as: 'storage',
  })

  StorageManagement.hasMany(Asset, {
    foreignKey: 'storage_management_id',
    as: 'storage',
  })

  Asset.belongsTo(Condition, {
    foreignKey: 'condition_id',
    as: 'condition',
  })

  // STORAGE MANAGEMENT
  StorageManagement.belongsTo(Unit, {
    foreignKey: 'unit_id',
    as: 'unit',
  })
  Unit.hasMany(StorageManagement, {
    foreignKey: 'unit_id',
    as: 'unit',
  })

  StorageManagement.belongsTo(Building, {
    foreignKey: 'building_id',
    as: 'building',
  })
  Building.hasMany(StorageManagement, {
    foreignKey: 'building_id',
    as: 'building_storage',
  })

  StorageManagement.belongsTo(Floor, {
    foreignKey: 'floor_id',
    as: 'storage_floor',
  })
  Floor.hasMany(StorageManagement, {
    foreignKey: 'floor_id',
    as: 'floor_storage',
  })

  StorageManagement.belongsTo(Room, {
    foreignKey: 'room_id',
    as: 'storage_room',
  })
  Room.hasMany(StorageManagement, {
    foreignKey: 'room_id',
    as: 'room_storage',
  })

  /* STOCK ADJUSTMENT */
  StockAdjustment.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'created_by',
  })

  User.hasMany(StockAdjustment, {
    foreignKey: 'created_by_id',
    as: 'created_by',
  })

  /*  STOCK ADJUSTMENT INVENTORY */
  // stock adjustment
  StockAdjustmentInventory.belongsTo(StockAdjustment, {
    foreignKey: 'stock_adjustment_id',
    as: 'stock_adjustment',
  })

  StockAdjustment.hasMany(StockAdjustmentInventory, {
    foreignKey: 'stock_adjustment_id',
    as: 'stock_adjustment',
  })
  // asset
  StockAdjustmentInventory.belongsTo(Asset, {
    foreignKey: 'asset_id',
    as: 'asset',
  })

  Asset.hasMany(StockAdjustmentInventory, {
    foreignKey: 'asset_id',
    as: 'asset',
  })

  // condition
  StockAdjustmentInventory.belongsTo(Condition, {
    foreignKey: 'previous_condition_id',
    as: 'previous_condition',
  })

  Condition.hasMany(StockAdjustmentInventory, {
    foreignKey: 'previous_condition_id',
    as: 'previous_condition',
  })

  StockAdjustmentInventory.belongsTo(Condition, {
    foreignKey: 'current_condition_id',
    as: 'current_condition',
  })

  Condition.hasMany(StockAdjustmentInventory, {
    foreignKey: 'current_condition_id',
    as: 'current_condition',
  })

  //user
  User.belongsTo(Unit, {
    foreignKey: 'unit_id',
    as: 'unit',
  })
}
