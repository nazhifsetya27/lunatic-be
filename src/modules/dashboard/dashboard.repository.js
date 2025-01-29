const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { StockAdjustment, Asset, Condition } = Models

exports.collections = async (req, res) => {
  const { date_range } = req.query
  const whereClause = {}
  if (date_range && date_range.length === 2) {
    const [startDate, endDate] = date_range
    whereClause.created_at = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    }
  }

  const data = await StockAdjustment.findAll({
    where: whereClause,
    include: [
      {
        association: 'stock_adjustment',
        include: [
          {
            association: 'asset',
            attributes: ['id', 'name', 'storage_management_id'],
            include: [
              {
                association: 'storage',
                include: {
                  association: 'unit',
                  attributes: ['id', 'name'],
                },
              },
            ],
          },
        ],
      },
    ],
  })

  const total = data.length
  const summary = {
    approved: 0,
    rejected: 0,
    waiting_for_approval: 0,
    in_progress: 0,
  }
  data.forEach((stockAdj) => {
    stockAdj.stock_adjustment = stockAdj.stock_adjustment.filter(
      (item) => item.asset?.storage?.unit?.id === req.user.unit_id
    )
  })

  data.forEach((item) => {
    if (item.status === 'Approved') {
      summary.approved += 1
    } else if (item.status === 'Rejected') {
      summary.rejected += 1
    } else if (item.status === 'Waiting for approval') {
      summary.waiting_for_approval += 1
    } else if (item.status === 'On progress') {
      summary.in_progress += 1
    }
  })

  const approvedPercentage = total
    ? ((summary.approved / total) * 100).toFixed(2) + '%'
    : '0%'
  const rejectedPercentage = total
    ? ((summary.rejected / total) * 100).toFixed(2) + '%'
    : '0%'
  const waitingForApprovalPercentage = total
    ? ((summary.waiting_for_approval / total) * 100).toFixed(2) + '%'
    : '0%'
  const inProgressPercentage = total
    ? ((summary.in_progress / total) * 100).toFixed(2) + '%'
    : '0%'

  const asset = await Asset.findAll({
    where: {
      '$storage.unit_id$': req.user.unit_id,
    },
    include: [
      {
        association: 'storage',
        include: {
          association: 'unit',
          attributes: ['id', 'name'],
        },
      },
      {
        association: 'condition',
        attributes: ['id', 'name'],
      },
    ],
    attributes: [
      'id',
      'name',
      'category',
      'storage_management_id',
      'condition_id',
    ],
  })

  const conditions = await Condition.findAll({
    attributes: ['id', 'name'],
  })

  const conditionMap = {}
  conditions.forEach((cond) => {
    conditionMap[cond.id] = cond.name
  })

  const summary2 = {}
  asset.forEach((item) => {
    const category = item.category.toLowerCase() || 'Uncategorized'
    const conditionId = item.condition_id
    const conditionName = conditionMap[conditionId] || 'Unknown'
    if (!summary2[category]) {
      summary2[category] = { total: 0, conditions: {} }

      conditions.forEach((cond) => {
        summary2[category].conditions[cond.name] = {
          count: 0,
          percentage: '0.00%',
        }
      })
    }

    summary2[category].total++

    if (summary2[category].conditions[conditionName]) {
      summary2[category].conditions[conditionName].count++
    }
  })

  Object.keys(summary2).forEach((category) => {
    const totalAssets = summary2[category].total

    Object.keys(summary2[category].conditions).forEach((condition) => {
      const count = summary2[category].conditions[condition].count
      const percentage = totalAssets
        ? ((count / totalAssets) * 100).toFixed(2) + '%'
        : '0.00%'

      summary2[category].conditions[condition].percentage = percentage
    })
  })

  const result = {
    job_order_summary: {
      approved: summary.approved.toString(),
      rejected: summary.rejected.toString(),
      waiting_for_approval: summary.waiting_for_approval.toString(),
      in_progress: summary.in_progress.toString(),
      approved_percentage: approvedPercentage,
      in_progress_percentage: inProgressPercentage,
      rejected_percentage: rejectedPercentage,
      waiting_for_approval_percentage: waitingForApprovalPercentage,
    },
    asset_summary: summary2,
  }

  return { data: result }
}
