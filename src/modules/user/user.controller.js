const { Request } = require('../../helper')
const { Models } = require('../../sequelize/models')
const { detailGeneral, collections } = require('./user.repository')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { User } = Models

exports.getAllUsers = async (req, res) => {
  try {
    Request.success(res, await collections(req, res))
  } catch (error) {
    Request.error(res, error)
  }
}

exports.unitList = async (req, res) => {
  try {
    const { search } = req.query
    const where = {}
    if (search)
      where[Op.or] = {
        name: { [Op.iLike]: `%${search}%` },
      }
    const data = await Models.Unit.findAll({
      where,
      limit: 100,
      attributes: ['id', 'name'],
    })
    Request.success(res, { data })
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

    post.password = bcrypt.hashSync(post.password)

    await User.update(post, { where: { id }, req })
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

exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params
    const roles = ['Administrator', 'Approver']

    const user = await User.findOne({
      where: {
        id,
      },
      paranoid: false,
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (roles.includes(user.role)) {
      const usersExistsRole = await User.findOne({
        where: {
          role: {
            [Op.in]: roles,
          },
        },
        paranoid: false,
      })

      if (usersExistsRole) {
        throw 'User with same roler already exists'
      }
    }

    await user.restore()

    Request.success(res, { message: 'Restore Data Successed' })
  } catch (error) {
    Request.error(res, error)
  }
}
