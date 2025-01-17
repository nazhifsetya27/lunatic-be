const { Sequelize } = require('sequelize')
require('dotenv').config()

const isSSLRequired =
  process.env.DB_HOST === 'ep-bitter-rice-a1z6xypc.ap-southeast-1.aws.neon.tech'

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    ...(isSSLRequired && {
      dialectOptions: {
        ssl: {
          require:
            process.env.DB_HOST ===
            'ep-bitter-rice-a1z6xypc.ap-southeast-1.aws.neon.tech',
          rejectUnauthorized: false, // Skip certificate validation (optional, use with caution)
        },
      },
    }),
  }
)

module.exports = sequelize
