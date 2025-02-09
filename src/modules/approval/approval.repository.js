const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')

const { Approval, Asset } = Models
const { sequelize } = Models.Approval
const { Query } = require('../../helper')

exports.collections = async (req, res) => {
  const {
    page = 1,
    page_size = 10,
    archive,
    search,
    status = 'view all',
    filter,
  } = req.query
  const numberPage = Number(page)

  const where = { [Op.and]: [] }

  if (search) {
    where[Op.and].push({
      [Op.or]: [{ '$stock_adjustment.name$': { [Op.iLike]: `%${search}%` } }],
    })
  }

  if (filter) where[Op.and].push(Query.parseFilter(filter, Models.Approval))

  const query = {
    where,
    include: [
      {
        association: 'stock_adjustment',
        required: true,
        include: [
          {
            association: 'stock_adjustment',
            // required: true,
            include: [
              {
                association: 'asset',
                attributes: ['id', 'name', 'storage_management_id'],
                include: [
                  {
                    association: 'storage',
                    include: {
                      association: 'unit',
                      required: true,
                      attributes: ['id', 'name'],
                      where: {
                        id: req.user.unit_id,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
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
  } else if (status === 'Waiting for approval') {
    where.status = 'Waiting for approval'
  } else if (status === 'Rejected') {
    where.status = 'Rejected'
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
    filter: [
      Query.filter('approver_id', 'Approver', 'select', {
        path: '/option/approver-list',
        key: 'id',
        optionLabel: 'name',
      }),
      Query.filter('requester_id', 'Requester', 'select', {
        path: '/option/requester-list',
        key: 'id',
        optionLabel: 'name',
      }),
    ],
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

exports.approveData = async (req) => {
  const data = await sequelize.transaction(async (transaction) => {
    const { id } = req.params
    const { status, description } = req.body

    console.log(req.user.role, '<<<<<')

    if (req.user.role !== 'Administrator' && req.user.role !== 'Approver') {
      throw 'Unauthorized'
    }

    const approval = await Approval.findOne({
      where: {
        id,
      },
      paranoid: false,
      include: [
        {
          association: 'stock_adjustment',
          include: [
            {
              association: 'stock_adjustment',
            },
          ],
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
      transaction,
    })

    if (status === 'Rejected') {
      await approval.update(
        {
          status: 'Rejected',
          description,
          approver_id: req.user.id,
        },
        { transaction }
      )

      if (approval.stock_adjustment) {
        await approval.stock_adjustment.update(
          { status: 'Rejected' },
          { transaction }
        )
      }

      return { message: 'Approval rejected and stock adjustment updated' }
    }

    if (status === 'Approved') {
      const stockAdjustmentInventory =
        approval.stock_adjustment?.stock_adjustment

      if (!stockAdjustmentInventory || stockAdjustmentInventory.length === 0) {
        throw 'No stock adjustment inventory found'
      }

      const updates = stockAdjustmentInventory.map((item) => ({
        asset_id: item.asset_id,
        condition_id: item.current_condition_id,
      }))

      for (const update of updates) {
        await Asset.update(
          { condition_id: update.condition_id },
          {
            where: { id: update.asset_id },
            transaction,
          }
        )
      }

      await approval.update(
        {
          status: 'Approved',
          description,
          approver_id: req.user.id,
        },
        { transaction }
      )

      if (approval.stock_adjustment) {
        await approval.stock_adjustment.update(
          { status: 'Approved' },
          { transaction }
        )
      }

      return { message: 'Assets updated and approval approved' }
    }
  })

  return data
}
