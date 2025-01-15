const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Query } = require('../../helper')
const { saveImage } = require('../../helper/file')

const { sequelize } = Models.StockAdjustmentInventory

const { StockAdjustment, StockAdjustmentInventory, Asset, Approval } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter, type } = req.query
  const { stock_adjustment_id } = req.params

  if (!stock_adjustment_id) throw 'Stock adjustment id not found!'
  const numberPage = Number(page)

  const where = {
    stock_adjustment_id,
    [Op.and]: [],
  }

  switch (type) {
    case 'furniture':
      where[Op.and].push({ '$asset.category$': 'Furniture' })
      break
    case 'elektronik':
      where[Op.and].push({ '$asset.category$': 'Elektronik' })
      break
    case 'umum':
      where[Op.and].push({ '$asset.category$': 'Umum' })
      break

    default:
      break
  }

  if (filter)
    where[Op.and].push(
      Query.parseFilter(filter, Models.StockAdjustmentInventory)
    )

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    include: [
      {
        paranoid: false,
        association: 'stock_adjustment',
        attributes: ['id', 'name', 'status'],
      },
      {
        paranoid: false,
        association: 'asset',
        attributes: ['id', 'name', 'kode', 'category'],
        include: [
          {
            paranoid: false,
            association: 'condition',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        paranoid: false,
        association: 'previous_condition',
        attributes: ['id', 'name'],
      },
      {
        paranoid: false,
        association: 'current_condition',
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

  const data = await StockAdjustmentInventory.findAndCountAll(query)
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
    // filter: [
    //   Query.filter('condition_id', 'Condition', 'select', {
    //     path: '/option/condition-list',
    //     key: 'id',
    //     optionLabel: 'name',
    //   }),
    // ],
  }
}

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { stock_adjustment_id, asset_id, previous_condition_id } = req.body

    const stock_adjustment_inventory = await StockAdjustmentInventory.create(
      {
        stock_adjustment_id,
        asset_id,
        previous_condition_id,
        current_condition_id: null,
      },
      { req, transaction }
    )

    await Asset.update(
      { is_being_adjusted: true },
      {
        where: { id: asset_id },
        transaction,
      }
    )

    return stock_adjustment_inventory
  })

  return { data }
}

exports.adjustData = async (req) => {
  // file naming stock adjustment inventory -> {SA_INVENTORY_ID}
  const data = await sequelize.transaction(async (transaction) => {
    const { current_condition_id } = req.body
    const { stock_adjustment_inventory_id } = req.params

    const stock_adjustment_inventory = await StockAdjustmentInventory.findOne({
      where: {
        id: stock_adjustment_inventory_id,
      },
    })

    // save evidence to server
    const photo_url = await saveImage(
      req.file.photo,
      stock_adjustment_inventory.id,
      'stock_adjustment'
    )

    // update condition
    await stock_adjustment_inventory.update(
      {
        current_condition_id,
        evidence_url: photo_url,
      },
      { req, transaction }
    )

    return stock_adjustment_inventory
  })

  return { data }
}

exports.submitAdjustment = async (req) => {
  // ubah status stock adjustment jadi waiting for approval
  // masukkan data stock adjustment kedalam table approval
  const data = await sequelize.transaction(async (transaction) => {
    const { current_condition_id } = req.body
    const { stock_adjustment_id } = req.params

    // cek apakah stock adjustment inventory sudah ada yang diedit
    const stock_adjustment_inventory = await StockAdjustmentInventory.findAll({
      where: { stock_adjustment_id },
    })
    if (stock_adjustment_inventory.length < 1)
      throw 'please create adjustment first!'

    await Promise.all(
      stock_adjustment_inventory.map(async (val) => {
        // hilangkan flag is_being_adjusted pada asset
        const asset = await Asset.findOne({
          where: { id: val.asset_id },
        })
        await asset.update({ is_being_adjusted: false })

        if (val.current_condition_id === null)
          throw 'complete all adjustment first!'
        return val
      })
    )

    // ubah status stock adjustment jadi waiting for approval
    const stockAdjustment = await StockAdjustment.findOne({
      where: { id: stock_adjustment_id },
    })
    if (!stockAdjustment) throw 'Stock Adjustment not found'
    stockAdjustment.update(
      {
        status: 'Waiting for approval',
      },
      { req, transaction }
    )

    // masukkan data stock adjustment kedalam table approval
    const approval = await Approval.create(
      {
        stock_adjustment_id: stockAdjustment.id,
        status: 'Waiting for approval',
        requester_id: stockAdjustment.created_by_id,
        approver_id: null,
        description: null,
      },
      { req, transaction }
    )

    return approval
  })

  return { data }
}

exports.removeData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const { stock_adjustment_inventory_id } = req.params

    const stockAdjustmentInventory =
      await Models.StockAdjustmentInventory.findOne({
        where: { id: stock_adjustment_inventory_id },
        paranoid: false,
        transaction,
      })

    if (!stockAdjustmentInventory)
      throw new Error('Stock adjustment inventory not found')

    await stockAdjustmentInventory.destroy({ req, transaction, force: true })
  })
}
