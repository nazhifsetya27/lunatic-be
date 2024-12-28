const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Request } = require('../../helper')

const { Unit, Building, Floor, Room, StorageManagement } = Models

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
    const where = {}
    let allowedBuildingIds = []

    if (unit_id) {
      const storageManagements = await StorageManagement.findAll({
        where: { unit_id },
      })
      allowedBuildingIds = [
        ...new Set(storageManagements.map((val) => val.building_id)),
      ]
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
    const { search } = req.query
    const where = {}

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }
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
    const { search } = req.query
    const where = {}

    if (search)
      where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      }
    Request.success(res, {
      data: await Room.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}
