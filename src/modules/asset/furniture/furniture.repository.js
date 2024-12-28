const { Op } = require('sequelize')
const moment = require('moment')
const { Models } = require('../../../sequelize/models')

const { sequelize } = Models.Asset

const { Asset } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: { category: 'Furniture' } }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    include: [
      {
        association: 'room',
        include: [{ paranoid: false, association: 'floor' }],
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
    where: { id: req.params.id, category: 'Furniture' },
    paranoid: false,
  })
  if (!data) throw 'Furniture not found'

  return { data }
}

exports.detailData = async (req) => {
  const { id } = req.params

  const detailData = await Models.Asset.findOne({
    where: { id, category: 'Furniture' },
    paranoid: false,
    include: [
      {
        association: 'room',
        attributes: ['id', 'name', 'kode'],
        include: [
          {
            paranoid: false,
            association: 'floor',
            attributes: ['id', 'name', 'kode'],
            include: [
              {
                paranoid: false,
                association: 'building',
                attributes: ['id', 'name', 'kode'],
              },
            ],
          },
        ],
      },
    ],
  })

  if (!detailData) throw 'Detail data not found'

  const data = {
    nama: detailData.name,
    kode: detailData.kode,
    kategory: detailData.category,
    ruangan: detailData?.room ? detailData?.room.name : '-',
    lantai: detailData?.room ? detailData.room.floor.name : '-',
    gedung: detailData?.room ? detailData.room.floor.building.name : '-',
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
    const { name, kode, room_id } = req.body

    const furniture = await Asset.create(
      {
        name,
        kode,
        room_id,
        category: 'Furniture',
      },
      { transaction }
    )

    return furniture
  })

  return { data }
}

exports.updateData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const post = req.body

    const furniture = await Models.Asset.findOne({
      where: { id: req.params.id, category: 'Furniture' },
      paranoid: false,
      transaction,
    })

    if (!furniture) throw 'Data not found'

    await furniture.update(post, { req, transaction })
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
