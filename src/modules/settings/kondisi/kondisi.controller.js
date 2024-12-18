const { Op } = require('sequelize')
const { Request } = require('../../../helper')
const { Models } = require('../../../sequelize/models')

exports.index = async (req, res) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  if (archive === '1') {
    where.deleted_at = { [Op.not]: null }
  } else if (archive === '2') {
    where.deleted_at = { [Op.is]: null }
  }

  try {
    const condition = await Models.Condition.findAndCountAll({
      where,
      limit: page_size,
      paranoid: archive !== 1,
      offset: (page - 1) * page_size,
      order: [['created_at', 'DESC']],
    })

    const total = condition.count
    const totalPage = Math.ceil(total / page_size)

    const returnedData = {
      data: condition.rows,
      meta: {
        current_page: numberPage,
        prev_page: numberPage === 1 ? null : numberPage - 1,
        next_page:
          numberPage === totalPage || total <= totalPage
            ? null
            : numberPage + 1,
        total_page: totalPage || 1,
        total,
      },
      // filter: [],
    }

    Request.success(res, {
      message: 'Success',
      data: condition.rows,
      meta: {
        current_page: numberPage,
        prev_page: numberPage === 1 ? null : numberPage - 1,
        next_page:
          numberPage === totalPage || total <= totalPage
            ? null
            : numberPage + 1,
        total_page: totalPage || 1,
        total,
      },
    })
  } catch (error) {
    Request.error(res, error)
  }
}
