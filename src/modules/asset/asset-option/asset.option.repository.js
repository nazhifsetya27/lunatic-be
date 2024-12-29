const { Op } = require('sequelize')
const { Models } = require('../../../sequelize/models')

const { StorageManagement, Unit, Building, Floor, Room } = Models

exports.unitList = async (req, res) => {
  const { search } = req.query
  const where = {}

  if (search)
    where[Op.or] = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    }

  const data = await Unit.findAll({
    where,
    attributes: ['id', 'name'],
    order: [['name', 'asc']],
  })

  return { data }
}

exports.buildingList = async (req) => {
  const { search, unit_id } = req.query
  const where = { [Op.and]: [] }
  let existingBuildingIds = []

  if (!unit_id) throw 'unit_id is required!'

  if (unit_id) {
    const storageManagements = await StorageManagement.findAll({
      where: { unit_id },
    })
    existingBuildingIds = [
      ...new Set(storageManagements.map((val) => val.building_id)),
    ]

    where[Op.and].push({ id: { [Op.in]: existingBuildingIds } })
  }

  if (search)
    where[Op.or] = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    }

  const data = await Building.findAll({
    where,
    attributes: ['id', 'name'],
    order: [['name', 'asc']],
  })

  return { data }
}

exports.floorList = async (req) => {
  const { search, unit_id, building_id } = req.query
  const where = { [Op.and]: [] }
  let existingFloorId = []

  if (!unit_id) throw 'unit_id is required!'
  if (!building_id) throw 'building_id is required!'

  if (unit_id) {
    const storageManagements = await StorageManagement.findAll({
      where: { unit_id, building_id },
    })
    existingFloorId = [
      ...new Set(storageManagements.map((val) => val.floor_id)),
    ]

    where[Op.and].push({ id: { [Op.in]: existingFloorId } })
  }

  if (search)
    where[Op.or] = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    }

  const data = await Floor.findAll({
    where,
    attributes: ['id', 'name'],
    order: [['name', 'asc']],
  })

  return { data }
}

exports.roomList = async (req) => {
  const { search, unit_id, building_id, floor_id } = req.query
  const where = { [Op.and]: [] }
  let existingRoomId = []

  if (!unit_id) throw 'unit_id is required!'
  if (!building_id) throw 'building_id is required!'
  if (!floor_id) throw 'floor_id is required!'

  if (unit_id) {
    const storageManagements = await StorageManagement.findAll({
      where: { unit_id, building_id, floor_id },
    })
    existingRoomId = [...new Set(storageManagements.map((val) => val.room_id))]

    where[Op.and].push({ id: { [Op.in]: existingRoomId } })
  }

  if (search)
    where[Op.or] = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    }

  const data = await Room.findAll({
    where,
    attributes: ['id', 'name'],
    order: [['name', 'asc']],
  })

  return { data }
}
