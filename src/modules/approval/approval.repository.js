const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')

const { Approval } = Models

exports.collections = async (req, res) => {
  const { page = 1, page_size = 10, archive, search } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  const query = {
    where,
    include: [
      {
        association: 'stock_adjustment',
      },
      {
        association: 'requester',
        attributes: ['id', 'name'],
      },
      {
        association: 'approver',
        attributes: ['id', 'name'],
      },
    ],
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  }

  if (archive === '1') {
    where.deleted_at = { [Op.ne]: null }
    query.paranoid = false
  }

  const data = await Approval.findAndCountAll(query)
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
