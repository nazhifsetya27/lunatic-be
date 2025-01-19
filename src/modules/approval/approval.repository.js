const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')

const { Approval } = Models
const { sequelize } = Models.Approval

exports.collections = async (req, res) => {
  const {
    page = 1,
    page_size = 10,
    archive,
    search,
    status = 'view all',
  } = req.query
  const numberPage = Number(page)

  const where = {}

  if (search) {
    where[Op.and].push({
      [Op.or]: [
        sequelize.literal(`EXISTS (
            SELECT *
            FROM "stock_adjustments" AS "sa"
            WHERE "approvals"."stock_adjustment_id" = "sa"."id"
            AND "sa"."name" ILIKE '%${search}%'
          )`),
      ],
    })
  }

  const query = {
    where,
    include: [
      {
        association: 'stock_adjustment',
      },
      {
        association: 'requester',
        attributes: ['id', 'name', 'role', 'photo_url'],
      },
      {
        association: 'approver',
        attributes: ['id', 'name', 'role', 'photo_url'],
      },
    ],
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  }

  if (status === 'approved') {
    where.status = 'Approved'
    query.paranoid = false
  } else if (status === 'pending approval') {
    where.status = 'Pending approval'
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

exports.detailApproval = async (req, res) => {
  const { id } = req.params

  const detailData = await Approval.findOne({
    where: {
      id,
    },
    paranoid: false,
    include: [
      {
        association: 'stock_adjustment',
      },
      {
        association: 'requester',
        attributes: ['id', 'name', 'role', 'photo_url'],
      },
      {
        association: 'approver',
        attributes: ['id', 'name', 'role', 'photo_url'],
      },
    ],
  })

  if (!detailData) throw 'detail data not found!'

  const data = {
    general_information: {
      'Stock adjustment name': detailData.stock_adjustment.name,
      description: detailData.description,
      status: detailData.status,
      Requester: detailData.requester?.name,
      Approver: detailData.approver?.name,
      'Created at': detailData.created_at,
      'Updated at': detailData.updated_at,
    },
  }
  return { data }
}
