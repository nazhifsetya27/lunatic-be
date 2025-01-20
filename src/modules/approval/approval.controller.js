const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { collections, detailApproval, approveData } = require('./approval.repository')

const { Approval } = Models

exports.getAllApproval = async (req, res) => {
  try {
    Request.success(res, await collections(req, res))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.getDetail = async (req, res) => {
  try {
    Request.success(res, await detailApproval(req, res))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.updateApproval = async (req, res) => {
  try {
    await approveData(req)
    Request.success(res, { message: 'Data successfully approved' })
  } catch (error) {
    Request.error(res, error)
  }
}
