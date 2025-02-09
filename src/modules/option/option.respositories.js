const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Request } = require('../../helper')

const {
  Unit,
  Building,
  Floor,
  Room,
  StorageManagement,
  Condition,
  Asset,
  User,
} = Models

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

exports.assetList = async (req, res) => {
  try {
    const { search, isStockAdjustment } = req.query
    const where = { is_being_adjusted: false }

    if (search) {
      // If not a stock adjustment search
      // if (!isStockAdjustment) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`, // Search by name
          },
        },
      ]
      // }

      // if (isStockAdjustment) {
      //   where[Op.and] = where[Op.and] || []
      //   where[Op.and].push({
      //     [Op.or]: [
      //       {
      //         name: {
      //           [Op.iLike]: `%${search}%`, // Search by category
      //         },
      //       },
      //       {
      //         category: {
      //           [Op.iLike]: `%${search}%`, // Search by category
      //         },
      //       },
      //       {
      //         kode: {
      //           [Op.iLike]: `%${search}%`, // Search by kode
      //         },
      //       },
      //     ],
      //   })
      // }
    }

    Request.success(res, {
      data: await Asset.findAll({
        where,
        attributes: ['id', 'name', 'category', 'kode'],
        include: [
          {
            paranoid: false,
            association: 'condition',
            attributes: ['id', 'name'],
          },
        ],
        order: [['name', 'asc']],
      }),
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.kodeList = async (req, res) => {
  try {
    const { search, category } = req.query

    const where = {}

    if (category) {
      where.category = category
    }

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ]
    }

    const assetData = await Asset.findAll({
      where,
      attributes: ['id', 'name', 'category', 'kode'],
      order: [['name', 'asc']],
    })

    const arrayCode = assetData.map((val) => val.kode)
    const PrefixCode = arrayCode.map((val) => val.slice(0, 1))
    const numberCode = arrayCode.map((val) => val.slice(1, 2))

    const nextNumber = Math.max(...numberCode) + 1

    const finalCode = `${PrefixCode[0]}${nextNumber}`

    assetData.push({ name: '', kode: finalCode })

    Request.success(res, {
      data: assetData,
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.approverList = async (req, res) => {
  try {
    const { search } = req.query
    const where = { [Op.and]: [] }

    if (search) {
      where[Op.and].push({
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
      })
    }

    where[Op.and].push({
      role: { [Op.in]: ['Administrator', 'Approver'] },
    })

    where[Op.and].push({
      unit_id: req.user.unit_id,
    })

    const data = await Models.User.findAll({
      where,
      attributes: ['id', 'name', 'unit_id'],
    })

    const uniqueApprover = Array.from(new Set(data.map((a) => a.id))).map(
      (id) => {
        return data.find((a) => a.id === id)
      }
    )

    Request.success(res, { data: uniqueApprover })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.requesterList = async (req, res) => {
  try {
    const { search } = req.query
    const data = await Models.Approval.findAll({
      where: search ? { name: { [Op.iLike]: `%${search}%` } } : {},
      attributes: ['requester_id'],
      include: [
        {
          paranoid: false,
          association: 'requester',
          attributes: ['id', 'name'],
        },
      ],
    })

    const requester = data.map((el) => el.requester)

    const uniqueRequester = Array.from(new Set(requester.map((a) => a.id))).map(
      (id) => {
        return requester.find((a) => a.id === id)
      }
    )

    Request.success(res, { data: uniqueRequester })
  } catch (error) {
    Request.error(res, error)
  }
}
