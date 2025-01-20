/* eslint-disable array-callback-return */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
const { Op } = require('sequelize')
const moment = require('moment')
const { Workbook } = require('excel4node')
const { Models } = require('../../../sequelize/models')
const { Query } = require('../../../helper')

const { sequelize } = Models.Asset

const { Asset, StorageManagement } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const { user } = req
  const numberPage = Number(page)

  const where = {
    [Op.and]: [
      { category: 'Elektronik' },
      { '$storage.unit.id$': user?.unit?.id },
    ],
  }

  if (filter) where[Op.and].push(Query.parseFilter(filter, Models.Asset))

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
    filter: [
      Query.filter('condition_id', 'Condition', 'select', {
        path: '/option/condition-list',
        key: 'id',
        optionLabel: 'name',
      }),
    ],
  }
}

exports.showData = async (req) => {
  const data = await Models.Asset.findOne({
    where: { id: req.params.id, category: 'Elektronik' },
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

    const elektronik = await Asset.create(
      {
        name,
        kode,
        room_id,
        storage_management_id: storageManagement.id,
        condition_id: '714f523c-0130-41fa-8d09-e0025731b0db', // default SANGAT BAIK
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

    const storageManagement = await StorageManagement.findOne({
      where: {
        unit_id: post.unit_id,
        building_id: post.building_id,
        floor_id: post.floor_id,
        room_id: post.room_id,
      },
    })
    if (!storageManagement) throw 'storageManagement not found'

    const elektronik = await Models.Asset.findOne({
      where: { id: req.params.id, category: 'Elektronik' },
      paranoid: false,
      transaction,
    })

    if (!elektronik) throw 'Data not found'

    const submitData = {
      name: post.name,
      kode: post.kode,
      storage_management_id: storageManagement.id,
    }

    await elektronik.update(submitData, { req, transaction })
  })
}

exports.example = async (req, res) => {
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Asset')

  const asset_header = [
    'Name', // A
    'Kode', // B
    'Category', // C
    'Quantity', // D
    'Condition', // E
    'Unit', // F
    'Gedung', // G
    'Lantai', // H
    'Ruangan', // I
  ]

  asset_header.map((key, index) => {
    worksheet.cell(1, index + 1).string(key)
  })

  var style = workbook.createStyle({
    numberFormat: '@',
  })
  const totalRows = 15000
  const totalCols = asset_header.length

  for (let row = 2; row <= totalRows; row++) {
    for (let col = 1; col <= totalCols; col++) {
      worksheet.cell(row, col).style(style)
    }
  }

  var worksheet2 = workbook.addWorksheet('Category', {
    sheetProtection: { selectLockedCells: true },
  })

  const category_header = ['ID', 'Name']
  category_header.map((key, index) => {
    worksheet2.cell(1, index + 1).string(key)
  })

  const categoryData = [
    {
      id: '1',
      name: 'Elektronik',
    },
    {
      id: '2',
      name: 'Furniture',
    },
    {
      id: '3',
      name: 'Umum',
    },
  ]
  categoryData.map((data, index) => {
    worksheet2.cell(index + 2, 1).string(data.id)
    worksheet2.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'C2:C1000',
    formulas: [`=Category!$B$2:$B${parseInt(categoryData.length + 1)}`],
  })

  var worksheet3 = workbook.addWorksheet('Condition', {
    sheetProtection: { selectLockedCells: true },
  })

  const condition_header = ['ID', 'Name']
  condition_header.map((key, index) => {
    worksheet3.cell(1, index + 1).string(key)
  })

  const condition = await Models.Condition.findAll()

  condition.map((data, index) => {
    worksheet3.cell(index + 2, 1).string(data.id)
    worksheet3.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'E2:E1000',
    formulas: [`=Condition!$B$2:$B${parseInt(condition.length + 1)}`],
  })

  var worksheet4 = workbook.addWorksheet('Unit', {
    sheetProtection: { selectLockedCells: true },
  })

  const unit_header = ['ID', 'Name']
  unit_header.map((key, index) => {
    worksheet4.cell(1, index + 1).string(key)
  })

  const unit = await Models.Unit.findAll()

  unit.map((data, index) => {
    worksheet4.cell(index + 2, 1).string(data.id)
    worksheet4.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'F2:F1000',
    formulas: [`=Unit!$B$2:$B${parseInt(unit.length + 1)}`],
  })

  var worksheet5 = workbook.addWorksheet('Gedung', {
    sheetProtection: { selectLockedCells: true },
  })

  const gedung_header = ['ID', 'Name']
  gedung_header.map((key, index) => {
    worksheet5.cell(1, index + 1).string(key)
  })

  const gedung = await Models.Building.findAll()

  gedung.map((data, index) => {
    worksheet5.cell(index + 2, 1).string(data.id)
    worksheet5.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'G2:G1000',
    formulas: [`=Gedung!$B$2:$B${parseInt(gedung.length + 1)}`],
  })

  var worksheet6 = workbook.addWorksheet('Lantai', {
    sheetProtection: { selectLockedCells: true },
  })

  const lantai_header = ['ID', 'Name']
  lantai_header.map((key, index) => {
    worksheet6.cell(1, index + 1).string(key)
  })

  const lantai = await Models.Floor.findAll()

  lantai.map((data, index) => {
    worksheet6.cell(index + 2, 1).string(data.id)
    worksheet6.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'H2:H1000',
    formulas: [`=Lantai!$B$2:$B${parseInt(lantai.length + 1)}`],
  })

  var worksheet7 = workbook.addWorksheet('Ruangan', {
    sheetProtection: { selectLockedCells: true },
  })

  const ruangan_header = ['ID', 'Name']
  ruangan_header.map((key, index) => {
    worksheet7.cell(1, index + 1).string(key)
  })

  const ruangan = await Models.Room.findAll()

  ruangan.map((data, index) => {
    worksheet7.cell(index + 2, 1).string(data.id)
    worksheet7.cell(index + 2, 2).string(data.name)
  })

  worksheet.addDataValidation({
    type: 'list',
    error: 'Invalid choice was chosen',
    showDropDown: true,
    allowBlank: 1,
    sqref: 'I2:I1000',
    formulas: [`=Ruangan!$B$2:$B${parseInt(ruangan.length + 1)}`],
  })

  workbook.write('example-import-asset.xlsx', res)
}

exports.collectionExport = async (req, res) => {
  const data = await Models.Asset.findAll({
    where: {
      category: req.query.category,
    },
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

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Asset')
  const worksheet2 = workbook.addWorksheet('Filter')

  const asset_header = [
    'Name', // 1
    'Kode', // 2
    'Category', // 3
    'Quantity', // 4
    'Condition', // 5
    'Unit', // 6
    'Gedung', // 7
    'Lantai', // 8
    'Ruangan', // 9
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

  workbook.write(`export-${req.query.category}.xlsx`, res)
}

exports.printData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { id } = req.params

    const asset = await Models.Asset.findOne({
      where: { id },
      paranoid: false,
      include: [
        {
          association: 'storage',
          include: [
            {
              paranoid: false,
              association: 'unit',
              attributes: ['id', 'name', 'kode'],
            },
            {
              paranoid: false,
              association: 'building',
              attributes: ['id', 'name', 'kode'],
            },
            {
              paranoid: false,
              association: 'storage_floor',
              attributes: ['id', 'name', 'kode'],
            },
            {
              paranoid: false,
              association: 'storage_room',
              attributes: ['id', 'name', 'kode'],
            },
          ],
        },
        {
          paranoid: false,
          association: 'condition',
          attributes: ['id', 'name'],
        },
      ],
      transaction,
    })
    if (!asset) throw 'Data not found'

    const printCode = [
      asset?.kode,
      asset?.storage?.unit?.kode,
      asset?.storage?.storage_floor?.kode,
      asset?.storage?.storage_room?.kode,
      asset?.storage?.unit?.name?.toUpperCase().replace(/\s+/g, ''), // Convert to uppercase and remove spaces
      'EXCOMP',
      '2025',
    ]
      .filter(Boolean)
      .join('/')

    return { printCode, assetname: asset?.name, assetId: asset?.id }
  })
  return { data }
}
