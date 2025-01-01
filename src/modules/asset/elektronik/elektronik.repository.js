const { Op } = require('sequelize')
const moment = require('moment')
const { Models } = require('../../../sequelize/models')
const { Workbook } = require('excel4node')
const { sequelize } = Models.Asset

const { Asset } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: { category: 'Elektronik' } }

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
    where: { id: req.params.id, category: 'Elektronik' },
    paranoid: false,
  })
  if (!data) throw 'Furniture not found'

  return { data }
}

exports.detailData = async (req) => {
  const { id } = req.params

  const detailData = await Models.Asset.findOne({
    where: { id, category: 'Elektronik' },
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

    const elektronik = await Asset.create(
      {
        name,
        kode,
        room_id,
        category: 'Elektronik',
      },
      { transaction }
    )

    return elektronik
  })

  return { data }
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

exports.updateData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const post = req.body

    const elektronik = await Models.Asset.findOne({
      where: { id: req.params.id, category: 'Elektronik' },
      paranoid: false,
      transaction,
    })

    if (!elektronik) throw 'Data not found'

    await elektronik.update(post, { req, transaction })
  })
}

exports.example = async (req, res) => {
  var workbook = new Workbook()
  var worksheet = workbook.addWorksheet('Asset')

  const asset_header = [
    'Name', //A
    'Kode', //B
    'Category', //C
    'Quantity', //D
    'Condition', //E
    'Unit', //F
    'Gedung', //G
    'Lantai', //H
    'Ruangan', //I
  ]

  asset_header.map((key, index) => {
    worksheet.cell(1, index + 1).string(key)
  })
}

exports.collectionExport = async (req, res) => {
  const data = await Models.Asset.findAll({
    include: [
      {
        paranoid: false,
        association: 'condition',
        attributes: ['id', 'name'],
      },
      {
        paranoid: false,
        association: 'storage',
        include: [
          {
            association: 'unit',
            attributes: ['id', 'name'],
          },
          {
            association: 'building',
            attributes: ['id', 'name'],
          },
          {
            association: 'storage_floor',
            attributes: ['id', 'name'],
          },
          {
            association: 'storage_room',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
    order: [['created_at', 'desc']],
  })

  var workbook = new Workbook()
  var worksheet = workbook.addWorksheet('Asset')
  var worksheet2 = workbook.addWorksheet('Filter')

  const asset_header = [
    'Name', //1
    'Kode', //2
    'Category', //3
    'Quantity', //4
    'Condition', //5
    'Unit', //6
    'Gedung', //7
    'Lantai', //8
    'Ruangan', //9
  ]

  asset_header.map((key, index) => {
    worksheet.cell(1, index + 1).string(key)
  })
  worksheet.row(1).freeze()
  data.map((data, index) => {
    worksheet.cell(index + 2, 1).string(data.name ?? '')
    worksheet.cell(index + 2, 2).string(data.kode ?? '')
    worksheet.cell(index + 2, 3).string(data.category ?? '')
    worksheet.cell(index + 2, 4).string(data.quantity ?? '')
    worksheet.cell(index + 2, 5).string(data.condition?.name ?? '')
    worksheet.cell(index + 2, 6).string(data.storage?.unit?.name ?? '')
    worksheet.cell(index + 2, 7).string(data.storage?.building?.name ?? '')
    worksheet.cell(index + 2, 8).string(data.storage?.storage_floor?.name ?? '')
    worksheet.cell(index + 2, 9).string(data.storage?.storage_room?.name ?? '')
  })

  worksheet2.cell(1, 1).string('Search')
  worksheet2.cell(1, 2).string(req.query.search)
  worksheet2.cell(3, 1).string('Category')
  worksheet2.cell(3, 2).string(req.query.category)

  workbook.write('export-asset.xlsx', res)
}
