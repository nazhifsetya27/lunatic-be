const bcrypt = require('bcrypt') // Ensure bcrypt is installed
const jwt = require('jsonwebtoken') // Ensure jsonwebtoken is installed
const { Models } = require('../../sequelize/models')
const { Request } = require('../../helper')

const { User } = Models
const { sequelize } = User

const { JWT_SECRET_KEY } = process.env
if (!JWT_SECRET_KEY) throw 'JWT_SECRET_KEY is required!'

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    await sequelize.transaction(async (transaction) => {
      const user = await User.findOne(
        {
          where: { email },
          attributes: ['id', 'name', 'password'],
        },
        { req, transaction }
      )

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      // Compare provided password with stored password

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid email or password' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET_KEY,
        { expiresIn: '1d' }
      )

      return Request.success(res, {
        message: 'Login successful',
        data: { token },
      })
    })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const data = await User.findAll()
    Request.success(res, { data })
  } catch (error) {
    Request.error(res, error)
  }
}

exports.update = async (req, res) => {
  try {
    const user = req.user
    const post = req.body
    // if (req.file?.photo) {
    //   post.photo = saveImage(req.file.photo, user.id, 'users')
    // }
    // if (post.delete_photo) {
    //   post.photo = null
    // }

    if (post.new_password) {
      post.password = post.new_password
    }

    await user.update(post, { individualHooks: true, req })
    Request.success(res, { message: 'Success update data' })
  } catch (error) {
    Request.error(res, error)
  }
}
