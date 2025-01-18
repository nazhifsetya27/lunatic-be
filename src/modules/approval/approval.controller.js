const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { collections } = require('./approval.repository')

const { Approval } = Models

exports.getAllApproval = async (req, res) => {
  try {
    Request.success(res, await collections(req, res))
  } catch (error) {
    Request.error(res, error)
  }
}
