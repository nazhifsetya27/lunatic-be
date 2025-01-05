const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { detailGeneral } = require('./user.repository')

const { User } = Models

exports.getAllUsers = async (req, res) => {
  try {
    const data = await collections(req)
    Request.success(res, { message: 'Success', data })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.createUser = async (req, res) => {
  try {
    const post = req.body

    if (req.user.role !== 'Administrator') {
      throw new Error('Role anda tidak diizinkan')
    }

    const newData = await User.create(post, { req })
    Request.success(res, { message: 'Success', newData })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.show = async (req, res) => {
  try {
    Request.success(res, { data: req.findData })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.detail = async (req, res) => {
  try {
    const data = await detailGeneral(req, res)
    Request.success(res, { ...data })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.editUser = async (req, res) => {
  try {
    const post = req.body
    const { id } = req.params

    if (req.user.role !== 'Administrator') {
      throw new Error('Role anda tidak diizinkan')
    }

    await User.update(post, { req, where: { id } })
    Request.success(res, { message: 'Success' })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    await user.destroy()
    Request.success(res, { message: 'Remove Data Successed' })
  } catch (error) {
    Request.error(res, error)
  }
}
