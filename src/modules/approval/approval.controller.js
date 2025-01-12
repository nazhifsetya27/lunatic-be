const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { collections } = require('./approval.repository')

const { Approval } = Models

exports.getAllApproval = async (req, res) => {
  try {
    const data = await collections(req)
    Request.success(res, { message: 'Success', data })
  } catch (error) {
    Request.error(res, error)
  }
}
