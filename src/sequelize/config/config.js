require('dotenv').config()

const isSSLRequired =
  process.env.DB_HOST === 'ep-bitter-rice-a1z6xypc.ap-southeast-1.aws.neon.tech'

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.DB_TIMEZONE,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 5000,
    },
    ...(isSSLRequired && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Skip certificate validation (optional, use with caution)
        },
      },
    }),
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.DB_TIMEZONE,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 5000,
    },
    ...(isSSLRequired && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Skip certificate validation (optional, use with caution)
        },
      },
    }),
  },
}
