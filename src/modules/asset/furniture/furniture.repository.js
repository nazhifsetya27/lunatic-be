const { Op } = require('sequelize')
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
    order: [['created_at', 'DESC']],
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
