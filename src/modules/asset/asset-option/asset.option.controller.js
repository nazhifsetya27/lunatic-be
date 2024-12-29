const { Request } = require('../../../helper')
const {
  buildingList,
  unitList,
  floorList,
  roomList,
} = require('./asset.option.repository')

exports.unitList = async (req, res) => {
  try {
    Request.success(res, await unitList(req))
  } catch (error) {
    Request.error(res, error)
  }
}
exports.buildingList = async (req, res) => {
  try {
    Request.success(res, await buildingList(req))
  } catch (error) {
    Request.error(res, error)
  }
}
exports.floorList = async (req, res) => {
  try {
    Request.success(res, await floorList(req))
  } catch (error) {
    Request.error(res, error)
  }
}
exports.roomList = async (req, res) => {
  try {
    Request.success(res, await roomList(req))
  } catch (error) {
    Request.error(res, error)
  }
}
