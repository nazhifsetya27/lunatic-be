const jwt = require('jsonwebtoken')
const { Models } = require('../sequelize/models')
const { Request } = require('../helper')

const { User } = Models

const SECRET = process.env.JWT_SECRET_KEY
if (!SECRET) throw 'secret JWT required!'

exports.auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    const token = authorization
      ? authorization.replace('Bearer ', '')
      : req.query.token

    if (!token) throw 'error'

    const verify = jwt.verify(token, SECRET)

    if (!verify) throw 'error'

    const user = await User.findOne({
      where: { id: verify.id },
      attributes: ['id', 'name', 'email', 'role', 'photo_url', 'unit_id'],
    })

    if (!user) throw 'user not found'

    req.user = user

    next()
  } catch (error) {
    console.log(error)
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).send({
        status: 401,
        message: 'Your session has been ended',
      })
    } else Request.unAuthorized(res)
  }
}
