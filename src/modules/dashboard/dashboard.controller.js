const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { Op } = require('sequelize')
const { collections } = require('./dashboard.repository')

exports.getDashboard = async (req, res) => {
  try {
    Request.success(res, await collections(req, res))
  } catch (error) {
    Request.error(res, error)
  }
}
