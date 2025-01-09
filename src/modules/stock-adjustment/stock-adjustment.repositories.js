const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { Query } = require('../../helper')

const { sequelize } = Models.StockAdjustment

const { StockAdjustment } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (filter)
    where[Op.and].push(Query.parseFilter(filter, Models.StockAdjustment))

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    include: [
      {
        paranoid: false,
        association: 'created_by',
        attributes: ['id', 'name', 'role'],
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
