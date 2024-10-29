require('dotenv').config() // Load environment variables
const { Sequelize } = require('sequelize') // Import Sequelize
const dbConfig = require('./src/sequelize/config/config.js') // Adjust path if necessary

// Use the development configuration to test connection
const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    timezone: dbConfig.development.timezone,
    pool: dbConfig.development.pool,
    logging: console.log, // Optional: log SQL queries for debugging
  }
)

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })
  .finally(() => {
    sequelize.close() // Close the connection after the test
  })
