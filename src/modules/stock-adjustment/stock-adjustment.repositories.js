const { Op } = require('sequelize')
const moment = require('moment')
const { Models } = require('../../sequelize/models')
const { Query } = require('../../helper')

const { sequelize } = Models.StockAdjustment

const { StockAdjustment, StockAdjustmentInventory, Asset } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter, type } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (filter)
    where[Op.and].push(Query.parseFilter(filter, Models.StockAdjustment))

  if (search)
    where[Op.and].push({
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { status: { [Op.iLike]: `%${search}%` } },
        { '$created_by.name$': { [Op.iLike]: `%${search}%` } },
      ],
    })

  const query = {
    where,
    limit: page_size,
    include: [
      {
        paranoid: false,
        association: 'created_by',
        attributes: ['id', 'name', 'role', 'photo_url'],
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

  if (type === 'on_progress') {
    where.status = 'On progress'
  } else if (type === 'waiting_for_approval') {
    where.status = 'Waiting for approval'
  } else if (type === 'rejected') {
    where.status = 'Rejected'
  } else if (type === 'approved') {
    where.status = 'Approved'
  }

  const data = await StockAdjustment.findAndCountAll(query)
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
    const { name } = req.body
    const created_by_id = req.user.id

    if (!created_by_id) throw 'User not found!'

    const stock_adjustment = await StockAdjustment.create(
      {
        name,
        status: 'On progress',
        created_by_id,
      },
      { req, transaction }
    )

    return stock_adjustment
  })

  return { data }
}

exports.storeFromScanData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { user } = req
    const { adjustedAsset } = req
    const created_by_id = user.id

    const name = `${user?.name}/${moment()
      .locale('id')
      .format('DD MMMM YYYY • HH:mm')}/${adjustedAsset?.name}`

    const stock_adjustment = await StockAdjustment.create(
      {
        name,
        status: 'On progress',
        created_by_id,
      },
      { req, transaction }
    )
    //
    if (adjustedAsset.is_being_adjusted) throw 'can`t adjust this asset'

    // auto create SA inventory
    await StockAdjustmentInventory.create(
      {
        stock_adjustment_id: stock_adjustment?.id,
        asset_id: adjustedAsset?.id,
        previous_condition_id: adjustedAsset?.condition?.id,
        current_condition_id: null,
      },
      { req, transaction }
    )

    // update asset
    await Asset.update(
      { is_being_adjusted: true },
      {
        where: { id: adjustedAsset?.id },
        transaction,
      }
    )
    stock_adjustment.dataValues.category = adjustedAsset?.category
    return stock_adjustment
  })

  return { data }
}

exports.detailData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { id } = req.params

    const stock_adjustment = await StockAdjustment.findOne({
      where: { id },
      include: [
        {
          paranoid: false,
          association: 'created_by',
          attributes: ['id', 'name'],
        },
      ],
    })
    if (!stock_adjustment) throw 'stock adjustment not found!'

    const detailData = {
      'Created date': stock_adjustment?.created_at,
      'Created by': stock_adjustment?.created_by?.name,
    }
    return detailData
  })

  return { data }
}

exports.detailSAResultData = async (req) => {
  const { id } = req.params
  const { page_size = 10, page_detail = 1, detailTab } = req.query

  const stock_adjustment = await StockAdjustment.findOne({
    where: { id },
    include: [
      {
        paranoid: false,
        association: 'created_by',
        attributes: ['id', 'name'],
      },
    ],
  })
  if (!stock_adjustment) throw 'stock adjustment not found!'

  const whereSAI = { stock_adjustment_id: stock_adjustment.id, [Op.and]: [] }
  switch (detailTab) {
    case 'furniture':
      whereSAI[Op.and].push({ '$asset.category$': 'Furniture' })
      break
    case 'elektronik':
      whereSAI[Op.and].push({ '$asset.category$': 'Elektronik' })
      break
    case 'umum':
      whereSAI[Op.and].push({ '$asset.category$': 'Umum' })
      break

    default:
      break
  }

  const detailStockAdjustmentResult =
    await StockAdjustmentInventory.findAndCountAll({
      where: whereSAI,
      include: [
        {
          paranoid: false,
          association: 'asset',
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
    })
  if (!detailStockAdjustmentResult)
    throw 'stock adjustment inventory not found!'

  const total = detailStockAdjustmentResult.count
  const numberPage = Number(page_detail)
  const totalPage = Math.ceil(total / page_size)

  return {
    data: detailStockAdjustmentResult.rows,
    meta: {
      current_page: numberPage,
      prev_page: numberPage === 1 ? null : numberPage - 1,
      next_page:
        numberPage === totalPage || total <= totalPage ? null : numberPage + 1,
      total_page: totalPage || 1,
      total,
    },
  }
}
