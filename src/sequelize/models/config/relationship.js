// const Unit = require("../unit")

module.exports = (models) => {
  const { Floor, Building, Room, Asset, StorageManagement, Unit } = models

  Floor.belongsTo(Building, {
    foreignKey: 'gedung_id',
    as: 'building',
  })

  Building.hasMany(Floor, {
    foreignKey: 'gedung_id',
    as: 'building',
  })

  Room.belongsTo(Floor, {
    foreignKey: 'lantai_id',
    as: 'floor',
  })

  Floor.hasMany(Room, {
    foreignKey: 'lantai_id',
    as: 'floor',
  })

  Asset.belongsTo(Room, {
    foreignKey: 'room_id',
    as: 'room',
  })

  Room.hasMany(Asset, {
    foreignKey: 'room_id',
    as: 'room',
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
}
