const Sequelize = require('sequelize')

exports.Sequelize = Sequelize
exports.sequelizeDB = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    operatorAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 5000,
    },
    logging: false,
    minifyAliases: true,
  }
)
