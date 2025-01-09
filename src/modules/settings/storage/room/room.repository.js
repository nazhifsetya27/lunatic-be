const { Op } = require('sequelize')
const { Models } = require('../../../../sequelize/models')

const { sequelize } = Models.Room

const { Room } = Models

exports.collections = async (req) => {
  const { page = 1, page_size = 10, search, archive, filter } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    // include: [
    //   {
    //     association: 'floor',
    //     include: [{ paranoid: false, association: 'building' }],
    //   },
    // ],
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  }

  if (archive === '1') {
    where.deleted_at = { [Op.not]: null }
    query.paranoid = false
  } else if (archive === '2') {
    where.deleted_at = { [Op.is]: null }
  }

  const data = await Room.findAndCountAll(query)
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
  const data = await Room.findOne({
    where: { id: req.params.id },
    paranoid: false,
  })
  if (!data) throw 'Data not found'

  return { data }
}

exports.storeData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const post = req.body
    const result = await Room.create(post, { transaction })
    return result
  })

  return { data }
}

exports.updateData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const post = req.body

    const room = await Room.findOne({
      where: { id: req.params.id },
      paranoid: false,
      transaction,
    })

    if (!room) throw 'Data not found'

    await room.update(post, { req, transaction })
  })
}

exports.removeData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const data = await Room.findOne({
      where: { id: req.params.id },
      transaction,
    })
    if (!data) throw 'Data not found'
    await data.destroy({ req, transaction })
  })
}

exports.restoreData = async (req) => {
  await sequelize.transaction(async (transaction) => {
    const data = await Room.findOne({
      where: { id: req.params.id },
      paranoid: false,
      transaction,
    })
    if (!data) throw 'Data not found'
    await data.restore({ req, transaction })
  })
}
