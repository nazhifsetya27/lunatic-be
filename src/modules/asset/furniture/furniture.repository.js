const { Op } = require('sequelize')
const moment = require('moment')
const uuid = require('uuid')
const async = require('async')
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
      { category: 'Furniture' },
      ...(user?.unit?.id ? [{ '$storage.unit.id$': user.unit.id }] : []),
    ],
  }

  if (filter) where[Op.and].push(Query.parseFilter(filter, Models.Asset))

  if (search) {
    where[Op.and].push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { kode: { [Op.iLike]: `%${search}%` } },
      ],
    })
  }

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
      // kalau ada logic buat filter unit, baru nyalain
      // Query.filter('unit_id', 'Unit', 'select', {
      //   path: '/option/unit-list',
      //   key: 'id',
      //   optionLabel: 'name',
      // }),
    ],
  }
}

exports.showData = async (req) => {
  const data = await Models.Asset.findOne({
    where: { id: req.params.id, category: 'Furniture' },
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
      {
        association: 'asset',
        // attributes: ['id', 'name'],
        order: [['created_at', 'DESC']],
        include: [
          {
            association: 'stock_adjustment',
            where: {
              status: 'Approved',
            },
            include: [
              {
                paranoid: false,
                association: 'created_by',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            association: 'previous_condition',
            attributes: ['id', 'name'],
          },
          {
            association: 'current_condition',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  })

  if (!detailData) throw 'Detail data not found'

  const data = {
    'nomor ID': String(detailData?.nomor).padStart(4, '0'),
    nama: detailData.name,
    kode: detailData.kode,
    kondisi: detailData?.condition?.name ?? '-',
    kategory: detailData.category,
    'Tanggal perolehan': detailData?.acquisition_date
      ? moment(detailData?.acquisition_date)
          .locale('id')
          .format('DD MMMM YYYY • HH:mm')
      : '-',
    Harga: detailData?.price
      ? new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(detailData.price)
      : '-',
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

  const asset_history = detailData.asset
    .map((el) => ({
      stock_adjustment_inventory_created_at: el.created_at,
      stock_adjustment_created_by: el.stock_adjustment?.created_by?.name,
      asset_current_condition: el.current_condition?.name,
      asset_previous_condition: el.previous_condition?.name,
    }))
    .sort(
      (a, b) =>
        new Date(b.stock_adjustment_inventory_created_at) -
        new Date(a.stock_adjustment_inventory_created_at)
    )

  return { data, asset_history, raw: detailData }
}

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const {
      name,
      kode,
      acquisition_date,
      price,
      unit_id,
      building_id,
      floor_id,
      room_id,
    } = req.body

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

    const furniture = await Asset.create(
      {
        name,
        kode,
        acquisition_date,
        price,
        storage_management_id: storageManagement.id,
        // unit_id, // kalau ada logic buat filter unit, baru nyalain
        condition_id: '714f523c-0130-41fa-8d09-e0025731b0db', // default SANGAT BAIK
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

    // Build a dynamic where condition with null safety
    const whereCondition = {}
    if (post.unit_id) whereCondition.unit_id = post.unit_id
    if (post.building_id) whereCondition.building_id = post.building_id
    if (post.floor_id) whereCondition.floor_id = post.floor_id
    if (post.room_id) whereCondition.room_id = post.room_id

    // Check storage management existence
    const storageManagement = Object.keys(whereCondition).length
      ? await StorageManagement.findOne({ where: whereCondition })
      : null

    if (!storageManagement) throw 'storageManagement not found'

    // Find the furniture asset
    const furniture = await Models.Asset.findOne({
      where: { id: req.params.id, category: 'Furniture' },
      paranoid: false,
      transaction,
    })

    if (!furniture) throw 'Data not found'

    // Prepare submitData dynamically
    const submitData = {
      name: post.name,
      kode: post.kode,
      acquisition_date: post.acquisition_date,
      price: post.price,
    }

    // Only add storage_management_id if found
    if (storageManagement?.id) {
      submitData.storage_management_id = storageManagement.id
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

    // kode - gedung - lantai - ruangan - excomp - unit - tahun
    const printCode = [
      String(asset?.nomor).padStart(4, '0'),
      asset?.kode,
      asset?.storage?.building?.kode,
      asset?.storage?.storage_floor?.kode,
      asset?.storage?.storage_room?.kode,
      'EXCOMP',
      // asset?.storage?.unit?.kode,
      asset?.storage?.unit?.name?.toUpperCase().replace(/\s+/g, ''), // Convert to uppercase and remove spaces
      moment().format('YYYY'),
    ]
      .filter(Boolean)
      .join('/')

    return { printCode, assetname: asset?.name, assetId: asset?.id }
  })
  return { data }
}

exports.exampleData = async (req, res) => {
  const { user } = req

  /* GET ALL DATA */
  const conditions = await Models.Condition.findAll({
    attributes: ['id', 'name', 'description'],
  })
  const unitUser = await Models.Unit.findByPk(user?.unit_id, {
    attributes: ['id', 'name'],
  })

  // Building
  const building = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
    },
    distinct: true,
    include: [{ paranoid: false, association: 'building', duplicating: true }],
  })
  const distinctBuilding = building.filter(
    (item, index, self) =>
      self.findIndex((t) => t.building_id === item.building_id) === index
  )

  // Floor
  const floor = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
      floor_id: { [Op.ne]: null },
    },
    distinct: true,
    include: [
      { paranoid: false, association: 'storage_floor', duplicating: false },
    ],
  })
  const distinctFloor = floor.filter(
    (item, index, self) =>
      self.findIndex((t) => t.floor_id === item.floor_id) === index
  )

  // Floor
  const room = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
      room_id: { [Op.ne]: null },
    },
    distinct: true,
    include: [
      { paranoid: false, association: 'storage_room', duplicating: false },
    ],
  })
  const distinctRoom = room.filter(
    (item, index, self) =>
      self.findIndex((t) => t.room_id === item.room_id) === index
  )

  // Define all worksheets
  const wb = new Workbook()
  const WsFurnitures = wb.addWorksheet('Furnitures')
  const WsConditions = wb.addWorksheet('Conditions', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsBuilding = wb.addWorksheet('Building', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsRoom = wb.addWorksheet('Room', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsFloor = wb.addWorksheet('Floor', {
    sheetProtection: { selectLockedCells: true },
  })
  const wsRules = wb.addWorksheet('Rules', {
    sheetProtection: { selectLockedCells: true },
  })

  // Define all validations & rules
  const rules = []
  const validations = {
    Name: () => {
      const column = 'A'
      rules.push({ column: 'Name', req: 'Required', format: 'Text' })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Name'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Name already exists',
        type: 'custom',
        formulas: [`=COUNTIF($${column}:$${column}, INDIRECT("RC", 0)) = 1`],
      })
    },
    Code: () => {
      const column = 'B'
      rules.push({ column: 'Code', req: 'Required', format: 'Text' })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Code'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Code already exists',
        type: 'custom',
        formulas: [`=COUNTIF($${column}:$${column}, INDIRECT("RC", 0)) = 1`],
      })
    },
    Conditions: () => {
      const column = 'C'
      rules.push({
        column: 'Conditions',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Conditions'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Conditions!$A$2:$A$${conditions.length + 1}`],
      })
    },
    Unit: () => {
      const column = 'D'
      rules.push({
        column: 'Unit',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: false,
        type: 'list',
        formulas: ['Unit'],
      })
      if (unitUser?.name) {
        WsFurnitures.cell(2, 4).string(unitUser.name) // Place default value in row 2, column 4 (D2)
      }
    },
    Building: () => {
      const column = 'E'
      rules.push({
        column: 'Building',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Building'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Building!$A$2:$A$${distinctBuilding.length + 1}`],
      })
    },
    Floor: () => {
      const column = 'F' // Floor column
      const buildingColumn = 'E' // Building column reference

      rules.push({
        column: 'Floor',
        req: 'Required',
        format: 'Text',
      })

      // Apply list validation for Floor (dropdown list)
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to the Floor column
        allowBlank: true, // Allow blank if validation fails
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Floor!$A$2:$A$${distinctFloor.length + 1}`], // List of distinct floors
      })

      // Add a custom formula to disable Floor if Building is not filled
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to all rows in the Floor column
        type: 'custom',
        allowBlank: true, // Let the cell remain empty if validation fails
        error: 'Fill the Building column first',
        formulas: [`=LEN(E1)>0`], // Checks if the Building column (column E) in the same row is not empty
      })
    },
    Room: () => {
      const column = 'G'

      rules.push({
        column: 'Room',
        req: 'Required',
        format: 'Text',
      })

      // Apply list validation for Floor (dropdown list)
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to the Floor column
        allowBlank: true, // Allow blank if validation fails
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Room!$A$2:$A$${distinctRoom.length + 1}`], // List of distinct floors
      })

      // Add a custom formula to disable Floor if Building is not filled
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to all rows in the Floor column
        type: 'custom',
        allowBlank: true, // Let the cell remain empty if validation fails
        error: 'Fill the Building column first',
        formulas: [`=LEN(E1)>0`], // Checks if the Building column (column E) in the same row is not empty
      })
    },
  }

  // WORKSHEET : Furniture
  Object.entries(validations).forEach(([key, validation], index) => {
    WsFurnitures.cell(1, index + 1).string(key)
    validation()
  })
  WsFurnitures.row(1).freeze()

  // WORKSHEET : Condition
  const WsConditionsHeader = ['Name', 'Description']
  WsConditionsHeader.forEach((key, index) => {
    WsConditions.cell(1, index + 1).string(key)
  })
  conditions.forEach((data, index) => {
    WsConditions.cell(index + 2, 1).string(data.name)
    WsConditions.cell(index + 2, 2).string(data.description)
  })

  // WORKSHEET : building
  const WsbuildingHeader = ['Name', 'Kode']
  WsbuildingHeader.forEach((key, index) => {
    WsBuilding.cell(1, index + 1).string(key)
  })
  distinctBuilding.forEach((data, index) => {
    WsBuilding.cell(index + 2, 1).string(data.building.name)
    WsBuilding.cell(index + 2, 2).string(data.building.kode)
  })

  // WORKSHEET : Floor
  const WsFloorHeader = ['Name', 'Kode']
  WsFloorHeader.forEach((key, index) => {
    WsFloor.cell(1, index + 1).string(key)
  })
  distinctFloor.forEach((data, index) => {
    WsFloor.cell(index + 2, 1).string(data.storage_floor.name)
    WsFloor.cell(index + 2, 2).string(data.storage_floor.kode)
  })

  // WORKSHEET : Floor
  const WsRoomHeader = ['Name', 'Kode']
  WsRoomHeader.forEach((key, index) => {
    WsRoom.cell(1, index + 1).string(key)
  })
  distinctRoom.forEach((data, index) => {
    WsRoom.cell(index + 2, 1).string(data.storage_room.name)
    WsRoom.cell(index + 2, 2).string(data.storage_room.kode)
  })

  // WORKSHEET : RULES
  const wsRulesHeader = ['Column', 'Required/Optional', 'Format']
  wsRulesHeader.forEach((key, index) => {
    wsRules.cell(1, index + 1).string(key)
  })
  rules.forEach((data, index) => {
    wsRules.cell(index + 2, 1).string(data.column)
    wsRules.cell(index + 2, 2).string(data.req)
    wsRules.cell(index + 2, 3).string(data.format)
  })

  wb.write('example-import-furniture.xlsx', res)
}

exports.exampleDataAll = async (req, res) => {
  const { user } = req

  /* GET ALL DATA */
  const conditions = await Models.Condition.findAll({
    attributes: ['id', 'name', 'description'],
  })
  const unitUser = await Models.Unit.findByPk(user?.unit_id, {
    attributes: ['id', 'name'],
  })

  // Building
  const building = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
    },
    distinct: true,
    include: [{ paranoid: false, association: 'building', duplicating: true }],
  })
  const distinctBuilding = building.filter(
    (item, index, self) =>
      self.findIndex((t) => t.building_id === item.building_id) === index
  )

  // Floor
  const floor = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
      floor_id: { [Op.ne]: null },
    },
    distinct: true,
    include: [
      { paranoid: false, association: 'storage_floor', duplicating: false },
    ],
  })
  const distinctFloor = floor.filter(
    (item, index, self) =>
      self.findIndex((t) => t.floor_id === item.floor_id) === index
  )

  // Floor
  const room = await Models.StorageManagement.findAll({
    where: {
      unit_id: unitUser?.id,
      room_id: { [Op.ne]: null },
    },
    distinct: true,
    include: [
      { paranoid: false, association: 'storage_room', duplicating: false },
    ],
  })
  const distinctRoom = room.filter(
    (item, index, self) =>
      self.findIndex((t) => t.room_id === item.room_id) === index
  )

  // Define all worksheets
  const wb = new Workbook()
  const WsFurnitures = wb.addWorksheet('Asset')
  const WsConditions = wb.addWorksheet('Conditions', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsBuilding = wb.addWorksheet('Building', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsRoom = wb.addWorksheet('Room', {
    sheetProtection: { selectLockedCells: true },
  })
  const WsFloor = wb.addWorksheet('Floor', {
    sheetProtection: { selectLockedCells: true },
  })
  const wsRules = wb.addWorksheet('Rules', {
    sheetProtection: { selectLockedCells: true },
  })

  // Define all validations & rules
  const rules = []
  const validations = {
    Name: () => {
      const column = 'A'
      rules.push({ column: 'Name', req: 'Required', format: 'Text' })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Name'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Name already exists',
        type: 'custom',
        formulas: [`=COUNTIF($${column}:$${column}, INDIRECT("RC", 0)) = 1`],
      })
    },
    Code: () => {
      const column = 'B'
      rules.push({ column: 'Code', req: 'Required', format: 'Text' })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Code'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Code already exists',
        type: 'custom',
        formulas: [`=COUNTIF($${column}:$${column}, INDIRECT("RC", 0)) = 1`],
      })
    },
    Conditions: () => {
      const column = 'C'
      rules.push({
        column: 'Conditions',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Conditions'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Conditions!$A$2:$A$${conditions.length + 1}`],
      })
    },
    Unit: () => {
      const column = 'D'
      rules.push({
        column: 'Unit',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: false,
        type: 'list',
        formulas: ['Unit'],
      })
      if (unitUser?.name) {
        WsFurnitures.cell(2, 4).string(unitUser.name) // Place default value in row 2, column 4 (D2)
      }
    },
    Building: () => {
      const column = 'E'
      rules.push({
        column: 'Building',
        req: 'Required',
        format: 'Text',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['Building'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Building!$A$2:$A$${distinctBuilding.length + 1}`],
      })
    },
    Floor: () => {
      const column = 'F' // Floor column
      const buildingColumn = 'E' // Building column reference

      rules.push({
        column: 'Floor',
        req: 'Required',
        format: 'Text',
      })

      // Apply list validation for Floor (dropdown list)
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to the Floor column
        allowBlank: true, // Allow blank if validation fails
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Floor!$A$2:$A$${distinctFloor.length + 1}`], // List of distinct floors
      })

      // Add a custom formula to disable Floor if Building is not filled
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to all rows in the Floor column
        type: 'custom',
        allowBlank: true, // Let the cell remain empty if validation fails
        error: 'Fill the Building column first',
        formulas: [`=LEN(E1)>0`], // Checks if the Building column (column E) in the same row is not empty
      })
    },
    Room: () => {
      const column = 'G'

      rules.push({
        column: 'Room',
        req: 'Required',
        format: 'Text',
      })

      // Apply list validation for Floor (dropdown list)
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to the Floor column
        allowBlank: true, // Allow blank if validation fails
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: [`=Room!$A$2:$A$${distinctRoom.length + 1}`], // List of distinct floors
      })

      // Add a custom formula to disable Floor if Building is not filled
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`, // Apply validation to all rows in the Floor column
        type: 'custom',
        allowBlank: true, // Let the cell remain empty if validation fails
        error: 'Fill the Building column first',
        formulas: [`=LEN(E1)>0`], // Checks if the Building column (column E) in the same row is not empty
      })
    },
    category: () => {
      const column = 'H'
      rules.push({
        column: 'Category',
        req: 'Required',
        format: 'Furniture/Elektronik/Umum',
      })

      WsFurnitures.addDataValidation({
        sqref: `${column}1:${column}1`,
        allowBlank: false,
        error: 'Invalid choice was chosen',
        showDropDown: true,
        type: 'list',
        formulas: ['category'],
      })
      WsFurnitures.addDataValidation({
        sqref: `${column}:${column}`,
        allowBlank: false,
        error: 'category already exists',
        type: 'custom',
        formulas: [`=COUNTIF($${column}:$${column}, INDIRECT("RC", 0)) = 1`],
      })
    },
  }

  // WORKSHEET : Furniture
  Object.entries(validations).forEach(([key, validation], index) => {
    WsFurnitures.cell(1, index + 1).string(key)
    validation()
  })
  WsFurnitures.row(1).freeze()

  // WORKSHEET : Condition
  const WsConditionsHeader = ['Name', 'Description']
  WsConditionsHeader.forEach((key, index) => {
    WsConditions.cell(1, index + 1).string(key)
  })
  conditions.forEach((data, index) => {
    WsConditions.cell(index + 2, 1).string(data.name)
    WsConditions.cell(index + 2, 2).string(data.description)
  })

  // WORKSHEET : building
  const WsbuildingHeader = ['Name', 'Kode']
  WsbuildingHeader.forEach((key, index) => {
    WsBuilding.cell(1, index + 1).string(key)
  })
  distinctBuilding.forEach((data, index) => {
    WsBuilding.cell(index + 2, 1).string(data.building.name)
    WsBuilding.cell(index + 2, 2).string(data.building.kode)
  })

  // WORKSHEET : Floor
  const WsFloorHeader = ['Name', 'Kode']
  WsFloorHeader.forEach((key, index) => {
    WsFloor.cell(1, index + 1).string(key)
  })
  distinctFloor.forEach((data, index) => {
    WsFloor.cell(index + 2, 1).string(data.storage_floor.name)
    WsFloor.cell(index + 2, 2).string(data.storage_floor.kode)
  })

  // WORKSHEET : Floor
  const WsRoomHeader = ['Name', 'Kode']
  WsRoomHeader.forEach((key, index) => {
    WsRoom.cell(1, index + 1).string(key)
  })
  distinctRoom.forEach((data, index) => {
    WsRoom.cell(index + 2, 1).string(data.storage_room.name)
    WsRoom.cell(index + 2, 2).string(data.storage_room.kode)
  })

  // WORKSHEET : RULES
  const wsRulesHeader = ['Column', 'Required/Optional', 'Format']
  wsRulesHeader.forEach((key, index) => {
    wsRules.cell(1, index + 1).string(key)
  })
  rules.forEach((data, index) => {
    wsRules.cell(index + 2, 1).string(data.column)
    wsRules.cell(index + 2, 2).string(data.req)
    wsRules.cell(index + 2, 3).string(data.format)
  })

  wb.write('example-import-asset.xlsx', res)
}

exports.importData = async (req) => {
  const { furnitures } = req.body

  if (!furnitures?.length) throw 'Data is empty'

  const socket_name = uuid.v4()
  async function startImport() {
    let success = 0
    const failed = []
    let lastProgess = null
    let index = 0
    await async.eachSeries(furnitures, async (value) => {
      const element = { ...value, errors: [] }
      const furniture = {}

      try {
        await sequelize.transaction(async (transaction) => {
          // Validate and Assign data value

          // ========= Name
          if (!element.Name) element.errors.push('Name is required')
          else {
            furniture.name = element.Name
          }

          // ========= Code
          if (!element.Code) element.errors.push('Code is required')
          else {
            const existingCode = await Models.Asset.findOne({
              paranoid: false,
              where: {
                kode: element.Code,
              },
            })
            if (existingCode) element.errors.push('Code already exist!')
            else furniture.kode = element.Code
          }

          // ========= Condition
          if (!element.Conditions) element.errors.push('Condition is required')
          else {
            const condition = await Models.Condition.findOne({
              where: { name: element.Conditions },
            })
            furniture.condition_id = condition.id
          }

          // ========= Unit - Building - Floor - Room (asset_management_id)
          let unit
          let building
          let floor
          let room
          if (!element.Unit) element.errors.push('Unit is required')
          else {
            unit = await Models.Unit.findOne({
              where: { name: element.Unit },
            })
          }
          if (!element.Building) element.errors.push('Buillding is required')
          else {
            building = await Models.Building.findOne({
              where: { name: element.Building },
            })
          }
          if (!element.Floor) element.errors.push('Floor is required')
          else {
            floor = await Models.Floor.findOne({
              where: { name: element.Floor },
            })
          }
          if (!element.Room) element.errors.push('Room is required')
          else {
            room = await Models.Room.findOne({
              where: { name: element.Room },
            })
          }
          if (
            element.Unit &&
            element.Building &&
            element.Floor &&
            element.Room
          ) {
            const storagemanagement = await Models.StorageManagement.findOne({
              where: {
                unit_id: unit.id,
                building_id: building.id,
                floor_id: floor.id,
                room_id: room.id,
              },
            })

            if (!storagemanagement) {
              element.errors.push('Storage management not found!')
            } else {
              furniture.storage_management_id = storagemanagement.id
            }
          }

          // Create or update Furniture
          console.log('error element: ', element.errors)

          if (!element.errors.length) {
            const [newFurniture, created] = await Models.Asset.findOrCreate({
              req,
              transaction,
              paranoid: false,
              defaults: furniture,
              where: { name: furniture.name, category: 'Furniture' },
            })

            if (!created) {
              await newFurniture.update(furniture, { req, transaction })
            }
          }
        })
      } catch (error) {
        element.errors.push(error?.message ?? 'Something went wrong')
      }

      // Update progress
      if (!element.errors.length) success += 1
      else {
        console.log('error element', element.error)

        element.errors = element.errors.join(', ')
        failed.push(element)
      }
      const progress = Math.ceil(((index + 1) / furnitures.length) * 100)
      if (lastProgess !== progress) {
        lastProgess = progress
        io.emit(`upload-${socket_name}`, { progress })
      }

      index += 1
    })

    console.log('Success : ', success)
    console.log('Failed : ', failed)

    io.emit(`result-${socket_name}`, { result: { success, failed } })
  }

  startImport().catch(console.error)

  return { progress: `upload-${socket_name}`, result: `result-${socket_name}` }
}

exports.importDataAll = async (req) => {
  const { asset } = req.body

  if (!asset?.length) throw 'Data is empty'

  const socket_name = uuid.v4()
  async function startImport() {
    let success = 0
    const failed = []
    let lastProgess = null
    let index = 0
    await async.eachSeries(asset, async (value) => {
      const element = { ...value, errors: [] }
      const furniture = {}
      console.log(element)

      try {
        await sequelize.transaction(async (transaction) => {
          // Validate and Assign data value

          // ========= Name
          if (!element.Name) element.errors.push('Name is required')
          else {
            furniture.name = element.Name
          }

          // ========= Code
          if (!element.Code) element.errors.push('Code is required')
          else {
            const existingCode = await Models.Asset.findOne({
              paranoid: false,
              where: {
                kode: element.Code,
              },
            })
            if (existingCode) element.errors.push('Code already exist!')
            else furniture.kode = element.Code
          }

          // ========= Category
          if (!element.category) element.errors.push('Category is required')
          else furniture.category = element.category

          // ========= Condition
          if (!element.Conditions) element.errors.push('Condition is required')
          else {
            const condition = await Models.Condition.findOne({
              where: { name: element.Conditions },
            })
            furniture.condition_id = condition.id
          }

          // ========= Unit - Building - Floor - Room (asset_management_id)
          let unit
          let building
          let floor
          let room
          if (!element.Unit) element.errors.push('Unit is required')
          else {
            unit = await Models.Unit.findOne({
              where: { name: element.Unit },
            })
          }
          if (!element.Building) element.errors.push('Buillding is required')
          else {
            building = await Models.Building.findOne({
              where: { name: element.Building },
            })
          }
          if (!element.Floor) element.errors.push('Floor is required')
          else {
            floor = await Models.Floor.findOne({
              where: { name: element.Floor },
            })
          }
          if (!element.Room) element.errors.push('Room is required')
          else {
            room = await Models.Room.findOne({
              where: { name: element.Room },
            })
          }
          if (
            element.Unit &&
            element.Building &&
            element.Floor &&
            element.Room
          ) {
            const storagemanagement = await Models.StorageManagement.findOne({
              where: {
                unit_id: unit.id,
                building_id: building.id,
                floor_id: floor.id,
                room_id: room.id,
              },
            })

            if (!storagemanagement) {
              element.errors.push('Storage management not found!')
            } else {
              furniture.storage_management_id = storagemanagement.id
            }
          }

          // Create or update Furniture
          console.log('error element: ', element.errors)

          if (!element.errors.length) {
            const [newFurniture, created] = await Models.Asset.findOrCreate({
              req,
              transaction,
              paranoid: false,
              defaults: furniture,
              where: { name: furniture.name },
            })

            if (!created) {
              await newFurniture.update(furniture, { req, transaction })
            }
          }
        })
      } catch (error) {
        element.errors.push(error?.message ?? 'Something went wrong')
      }

      // Update progress
      if (!element.errors.length) success += 1
      else {
        console.log('error element', element.error)

        element.errors = element.errors.join(', ')
        failed.push(element)
      }
      const progress = Math.ceil(((index + 1) / asset.length) * 100)
      if (lastProgess !== progress) {
        lastProgess = progress
        io.emit(`upload-${socket_name}`, { progress })
      }

      index += 1
    })

    console.log('Success : ', success)
    console.log('Failed : ', failed)

    io.emit(`result-${socket_name}`, { result: { success, failed } })
  }

  startImport().catch(console.error)

  return { progress: `upload-${socket_name}`, result: `result-${socket_name}` }
}

exports.collectionExportAll = async (req, res) => {
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
    attributes: { exclude: ['quantity'] },
    order: [['created_at', 'desc']],
  })

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Asset')
  const worksheet2 = workbook.addWorksheet('Filter')

  const asset_header = [
    'Name', // 1
    'Kode', // 2
    'Category', // 3
    // 'Quantity', // 4
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
    // worksheet.cell(index + 2, 4).string(data.quantity ?? '')
    worksheet.cell(index + 2, 4).string(data.condition?.name ?? '')
    worksheet.cell(index + 2, 5).string(data.storage?.unit?.name ?? '')
    worksheet.cell(index + 2, 6).string(data.storage?.building?.name ?? '')
    worksheet.cell(index + 2, 7).string(data.storage?.storage_floor?.name ?? '')
    worksheet.cell(index + 2, 8).string(data.storage?.storage_room?.name ?? '')
  })

  worksheet2.cell(1, 1).string('Search')
  worksheet2.cell(1, 2).string(req.query.search)
  worksheet2.cell(3, 1).string('Category')
  worksheet2.cell(3, 2).string(req.query.category)

  workbook.write(`export-Asset.xlsx`, res)
}
