const bcrypt = require('bcryptjs')

const users = [
  {
    id: 'dd2b67f3-0df9-4aa6-8e7c-891c777eec26',
    name: 'Administrator',
    email: 'administrator@gmail.com',
    password: bcrypt.hashSync('administrator'),
    role: 'Administrator',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '08d1ee77-961f-4afd-9c67-2c7afe6823c9',
    name: 'Approver',
    email: 'approver@gmail.com',
    password: bcrypt.hashSync('approver'),
    role: 'Approver',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c10b06c6-50ac-4083-b0d8-556abde482ae',
    name: 'User',
    email: 'user@gmail.com',
    password: bcrypt.hashSync('user'),
    role: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  },
  // deleted later
  {
    id: '0c63fcf7-f312-414e-817e-bbb7bc2720be',
    name: 'nazhif',
    email: 'nazhif@gmail.com',
    password: bcrypt.hashSync('nazhif'),
    role: 'Administrator',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', users, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null)
  },
}
