module.exports = (models) => {
  const { Floor, Building, Room, Asset } = models

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
}
