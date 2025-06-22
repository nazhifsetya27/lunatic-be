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
    const { user } = req

    /* ---------- build WHERE ---------- */
    const where = { [Op.and]: [] }
    if (user?.unit?.id)
      where[Op.and].push({ '$storage.unit.id$': user.unit.id })

    const defaultPrefixCode = [
      { name: 'Furniture', kode: 'F1' },
      { name: 'Elektronik', kode: 'E1' },
      { name: 'Umum', kode: 'U1' },
    ]

    const { name: validCategory, kode: fallbackKode } =
      defaultPrefixCode.find((i) => i.name === category) ?? defaultPrefixCode[0]

    where[Op.and].push({ category: validCategory })

    if (search) {
      where[Op.and].push({ name: { [Op.iLike]: `%${search}%` } })
    }

    /* ---------- ambil aset ---------- */
    const rawAssets = await Asset.findAll({
      where,
      attributes: ['id', 'name', 'category', 'kode'],
      order: [['name', 'asc']],
      include: [
        {
          association: 'storage',
          include: [
            {
              association: 'unit',
              attributes: ['id', 'name'],
              paranoid: false,
            },
            {
              association: 'building',
              attributes: ['id', 'name'],
              paranoid: false,
            },
            {
              association: 'storage_floor',
              attributes: ['id', 'name'],
              paranoid: false,
            },
            {
              association: 'storage_room',
              attributes: ['id', 'name'],
              paranoid: false,
            },
          ],
        },
      ],
      raw: true,
    })

    /* ---------- dedup kode + hitung next ---------- */
    const uniqAssets = []
    const seenKode = new Set()

    rawAssets.forEach((row) => {
      if (row.kode && !seenKode.has(row.kode)) {
        seenKode.add(row.kode)
        uniqAssets.push(row)
      }
    })

    const existingCodes = [...seenKode] // array kode unik
    const prefix = fallbackKode.slice(0, 1) // F / E / U
    const nextNumber = existingCodes.length
      ? Math.max(...existingCodes.map((c) => +c.slice(1) || 0)) + 1
      : 1

    const nextKode = `${prefix}${nextNumber}`

    /* ---------- susun hasil ---------- */
    const responseData = [
      ...uniqAssets,
      { name: '', kode: nextKode }, // baris “dropdown default”
    ]

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
