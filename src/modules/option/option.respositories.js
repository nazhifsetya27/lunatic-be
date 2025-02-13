const { Op, Sequelize } = require('sequelize')
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
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`, // Search by name
          },
        },
        {
          kode: {
            [Op.iLike]: `%${search}%`, // Search by kode
          },
        },
        Sequelize.where(Sequelize.cast(Sequelize.col('nomor'), 'TEXT'), {
          [Op.iLike]: `%${search}%`, // Search by nomor (cast to TEXT)
        }),
      ]
    }

    Request.success(res, {
      data: await Asset.findAll({
        where,
        attributes: ['id', 'nomor', 'name', 'category', 'kode'],
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
    const defaultPrefixCode = [
      { name: 'Furniture', kode: 'F1' },
      { name: 'Elektronik', kode: 'E1' },
      { name: 'Umum', kode: 'U1' },
    ]

    // Validate category or use first default as fallback
    const validatedCategory = defaultPrefixCode.some(
      (item) => item.name === category
    )
      ? category
      : defaultPrefixCode[0].name

    if (validatedCategory) {
      where.category = validatedCategory
    }

    if (search) {
      where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }]
    }

    const assetData = await Asset.findAll({
      where,
      attributes: ['id', 'name', 'category', 'kode'],
      order: [['name', 'asc']],
    })

    // Get relevant codes
    let arrayCode
    if (!assetData.length) {
      const defaultEntry =
        defaultPrefixCode.find((item) => item.name === validatedCategory) ||
        defaultPrefixCode[0] // Fallback to first default
      arrayCode = [defaultEntry.kode]
    } else {
      arrayCode = assetData.map((val) => val.kode).filter(Boolean)
    }

    // Fallback if codes are still empty
    if (!arrayCode.length) {
      arrayCode = [defaultPrefixCode[0].kode]
    }

    // Extract prefix and number safely
    const firstCode = arrayCode[0] || 'U1' // Final fallback
    const prefix = firstCode.slice(0, 1)
    const numbers = arrayCode.map((code) => {
      const numPart = code.slice(1)
      return parseInt(numPart, 10) || 0
    })

    // Calculate next number (ensure minimum 1)
    const maxNumber = Math.max(...numbers, 0) // Handle empty numbers case
    const nextNumber = maxNumber

    // Generate final code
    const finalCode = `${prefix}${nextNumber}`

    // Prepare response
    const responseData = [...assetData]
    responseData.push({ name: '', kode: finalCode })

    Request.success(res, { data: responseData })
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
      (id) => data.find((a) => a.id === id)
    )

    Request.success(res, { data: uniqueApprover })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.requesterList = async (req, res) => {
  try {
    const { search } = req.query

    const where = { [Op.and]: [] }

    if (search) {
      where[Op.and].push({
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
      })
    }

    where[Op.and].push({
      '$requester.unit_id$': req.user.unit_id,
    })

    const data = await Models.Approval.findAll({
      where,
      attributes: ['requester_id'],
      include: [
        {
          paranoid: false,
          association: 'requester',
          attributes: ['id', 'name', 'unit_id'],
        },
      ],
    })

    const requester = data.map((el) => el.requester)

    const uniqueRequester = Array.from(new Set(requester.map((a) => a.id))).map(
      (id) => requester.find((a) => a.id === id)
    )

    Request.success(res, { data: uniqueRequester })
  } catch (error) {
    Request.error(res, error)
  }
}
