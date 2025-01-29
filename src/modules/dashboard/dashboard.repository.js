const { Op } = require('sequelize')
const { Models } = require('../../sequelize/models')
const { StockAdjustment } = Models

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
  }

  return { data: result }
}
