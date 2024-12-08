module.exports = (models) => {
  const { Floor, Gedung } = models

  Floor.belongsTo(Gedung, {
    foreignKey: 'gedung_id',
    as: 'gedung',
  })

  Gedung.hasMany(Floor, {
    foreignKey: 'gedung_id',
    as: 'gedung',
  })
}
