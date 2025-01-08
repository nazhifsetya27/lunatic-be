const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Request } = require('../../helper')

const { Unit, Building, Floor, Room, StorageManagement, Condition } = Models

exports.unitList = async (req, res) => {
  try {
    const { search } = req.query
    const where = {}

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }
    Request.success(res, {
      data: await Unit.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.buildingList = async (req, res) => {
  try {
    const { search, unit_id } = req.query
    const where = { [Op.and]: [] }
    let existingBuildingIds = []

    if (unit_id) {
      const storageManagements = await StorageManagement.findAll({
        where: { unit_id },
      })
      existingBuildingIds = [
        ...new Set(storageManagements.map((val) => val.building_id)),
      ]

      where[Op.and].push({ id: { [Op.notIn]: existingBuildingIds } })
    }

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }
    Request.success(res, {
      data: await Building.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.floorList = async (req, res) => {
  try {
    const { search, existing_ids } = req.query
    const where = { [Op.and]: [] }

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }

    if (existing_ids) where[Op.and].push({ id: { [Op.notIn]: existing_ids } })

    Request.success(res, {
      data: await Floor.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.roomList = async (req, res) => {
  try {
    const { search, existing_ids } = req.query
    const where = { [Op.and]: [] }

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
        kode: {
          [Op.iLike]: `%${search}%`,
        },
      }

    if (existing_ids) where[Op.and].push({ id: { [Op.notIn]: existing_ids } })

    Request.success(res, {
      data: await Room.findAll({
        where,
        attributes: ['id', 'name', 'kode'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.conditionList = async (req, res) => {
  try {
    const { search, existing_ids } = req.query
    const where = { [Op.and]: [] }

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }

    if (existing_ids) where[Op.and].push({ id: { [Op.notIn]: existing_ids } })

    Request.success(res, {
      data: await Condition.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}
