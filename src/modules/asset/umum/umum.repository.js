const { Op } = require('sequelize')
const moment = require('moment')
const { Models } = require('../../../sequelize/models')

const { sequelize } = Models.Asset

const { Asset, StorageManagement } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [{ category: 'Umum' }] }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    include: [
      {
        association: 'storage',
        include: [
          {
            paranoid: false,
            association: 'unit',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'building',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_floor',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_room',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        paranoid: false,
        association: 'condition',
        attributes: ['id', 'name'],
      },
    ],
    offset: (page - 1) * page_size,
    order: [['updated_at', 'DESC']],
  }

  if (archive === '1') {
    where.deleted_at = { [Op.not]: null }
    query.paranoid = false
  } else if (archive === '2') {
    where.deleted_at = { [Op.is]: null }
  }

  const data = await Asset.findAndCountAll(query)
  const total = data.count
  const totalPage = Math.ceil(total / page_size)

  return {
    data: data.rows,
    meta: {
      current_page: numberPage,
      prev_page: numberPage === 1 ? null : numberPage - 1,
      next_page:
        numberPage === totalPage || total <= totalPage ? null : numberPage + 1,
      total_page: totalPage || 1,
      total,
    },
    // filter: [],
  }
}

exports.showData = async (req) => {
  const data = await Models.Asset.findOne({
    where: { id: req.params.id, category: 'Umum' },
    paranoid: false,
    include: [
      {
        association: 'storage',
        include: [
          {
            paranoid: false,
            association: 'unit',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'building',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_floor',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_room',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  })
  if (!data) throw 'Data not found'

  return { data }
}

exports.detailData = async (req) => {
  const { id } = req.params

  const detailData = await Models.Asset.findOne({
    where: { id, category: 'Umum' },
    paranoid: false,
    include: [
      {
        association: 'storage',
        include: [
          {
            paranoid: false,
            association: 'unit',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'building',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_floor',
            attributes: ['id', 'name'],
          },
          {
            paranoid: false,
            association: 'storage_room',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        paranoid: false,
        association: 'condition',
        attributes: ['id', 'name'],
      },
    ],
  })

  if (!detailData) throw 'Detail data not found'

  const data = {
    nama: detailData.name,
    kode: detailData.kode,
    kondisi: detailData?.condition?.name ?? '-',
    kategory: detailData.category,
    unit: detailData?.storage?.unit?.name ?? '-',
    gedung: detailData?.storage?.building?.name ?? '-',
    lantai: detailData?.storage?.storage_floor?.name ?? '-',
    ruangan: detailData?.storage?.storage_room?.name ?? '-',
    'Tanggal dibuat': moment(detailData?.created_at)
      .locale('id')
      .format('DD MMMM YYYY • HH:mm'),
    'Terakhir diperbarui': moment(detailData?.updated_at)
      .locale('id')
      .format('DD MMMM YYYY • HH:mm'),
  }

  return { data }
}

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { name, kode, unit_id, building_id, floor_id, room_id } = req.body

    if (!unit_id) throw 'unit_id is required!'
    if (!building_id) throw 'building_id is required!'

    const whereClause = {
      unit_id,
      building_id,
    }

    if (floor_id) whereClause.floor_id = floor_id
    if (room_id) whereClause.room_id = room_id

    const storageManagement = await StorageManagement.findOne({
      where: whereClause,
    })
    if (!storageManagement) throw 'storageManagement not found'

    const umum = await Asset.create(
      {
        name,
        kode,
        room_id,
        storage_management_id: storageManagement.id,
        condition_id: '714f523c-0130-41fa-8d09-e0025731b0db', // default SANGAT BAIK
        category: 'Umum',
      },
      { transaction }
    )

    return umum
  })

  return { data }
}

exports.updateData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const post = req.body

    const storageManagement = await StorageManagement.findOne({
      where: {
        unit_id: post.unit_id,
        building_id: post.building_id,
        floor_id: post.floor_id,
        room_id: post.room_id,
      },
    })
    if (!storageManagement) throw 'storageManagement not found'

    const furniture = await Models.Asset.findOne({
      where: { id: req.params.id, category: 'Umum' },
      paranoid: false,
      transaction,
    })

    if (!furniture) throw 'Data not found'

    const submitData = {
      name: post.name,
      kode: post.kode,
      storage_management_id: storageManagement.id,
    }

    await furniture.update(submitData, { req, transaction })
  })
}

exports.removeData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const data = await Models.Asset.findOne({
      where: { id: req.params.id },
      transaction,
    })
    if (!data) throw 'Data not found'
    await data.destroy({ req, transaction })
  })
}

exports.restoreData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const data = await Models.Asset.findOne({
      where: { id: req.params.id },
      paranoid: false,
      transaction,
    })
    if (!data) throw 'Data not found'
    await data.restore({ req, transaction })
  })
}
