const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Query } = require('../../helper')
const { saveImage } = require('../../helper/file')

const { sequelize } = Models.StockAdjustmentInventory

const { StockAdjustmentInventory, Asset } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const { stock_adjustment_id } = req.params

  if (!stock_adjustment_id) throw 'Stock adjustment id not found!'

  const numberPage = Number(page)

  const where = {
    stock_adjustment_id,
    [Op.and]: [],
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
