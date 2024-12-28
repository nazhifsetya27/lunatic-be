const bcrypt = require('bcryptjs')

const conditions = [
  {
    id: '714f523c-0130-41fa-8d09-e0025731b0db',
    name: 'SANGAT BAIK',
    description: 'Kondisi baru atau penggunaan dibawah 3 tahun',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '750722c1-2117-4472-8603-2e4b7b6c3e7d',
    name: 'BAIK',
    description: 'Kondisi baik dan penggunaan diatas 3 tahun',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '02c5f0fb-d1cf-411e-9498-7403aa36d163',
    name: 'BURUK',
    description: 'Kondisi buruk (tidak bisa digunakan/kualitas menurun)',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'dbca4558-fb7a-4264-b687-afa1115d3c9e',
    name: 'SANGAT BURUK',
    description: 'Kondisi mati atau tidak bisa digunakan',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('conditions', conditions, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('conditions', null)
  },
}
