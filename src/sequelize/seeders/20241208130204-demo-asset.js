const assets = [
  {
    id: '99b6cf0b-d603-46c4-833c-7e5e0a0d2eea',
    name: 'Kursi Kerja',
    kode: 'F1',
    category: 'Furniture',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('assets', assets, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('assets', null)
  },
}
