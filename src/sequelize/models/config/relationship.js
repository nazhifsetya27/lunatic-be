module.exports = (models) => {
  const { Floor, Building } = models

  Floor.belongsTo(Building, {
    foreignKey: 'gedung_id',
    as: 'floor',
  })

  Building.hasMany(Floor, {
    foreignKey: 'gedung_id',
    as: 'floor',
  })
}
