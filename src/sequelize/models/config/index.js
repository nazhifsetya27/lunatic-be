const Sequelize = require('sequelize')

const isSSLRequired =
  process.env.DB_HOST === 'ep-bitter-rice-a1z6xypc.ap-southeast-1.aws.neon.tech'

exports.Sequelize = Sequelize
exports.sequelizeDB = new Sequelize.Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    operatorAliases: false,
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
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 5000,
    },
    logging: false,
    minifyAliases: true,
    define: {
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      },
      underscored: true, // Use snake_case for column names
      timestamps: true, // Enable createdAt/updatedAt timestamps globally
      paranoid: true, // Enable soft deletes globally (deletedAt column)
    },
  }
)
