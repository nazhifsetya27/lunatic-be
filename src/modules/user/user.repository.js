const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')

const { User } = Models

exports.collections = async (req, res) => {
  const { page = 1, page_size = 10, search } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (search)
    where[Op.and].push({ [Op.or]: { name: { [Op.iLike]: `%${search}%` } } })

  const query = {
    where,
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  }

  const data = await User.findAndCountAll(query)
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

exports.detailGeneral = async (req) => {
  const user = req.findData
  // check if customer bond with user is all_customer

  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    id: user.id,
  }

  const generalData = {
    personal: {
      Name: user.name,
      Email: user.email,
      Role: user.role,
    },
    general: {
      'Tanggal dibuat': user.created_at,
      'Terakhir diperbarui': user.updated_at,
    },
  }
  return {
    data: userData,
    general: generalData,
  }
}
