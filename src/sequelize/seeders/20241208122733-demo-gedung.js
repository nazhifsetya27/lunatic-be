const buildings = [
  {
    id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0',
    name: 'Gedung Opsis',
    kode: 'A',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '1ac961a0-13f3-4a20-8f6f-2dd0007cf1e7',
    name: 'Gedung Tata Usaha',
    kode: 'B',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2ac8ad32-c31d-4779-91de-7ad728262d8a',
    name: 'Gedung TI',
    kode: 'C',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ec804a92-883f-4972-ae20-c1e02cdf4276',
    name: 'Gedung Serbaguna',
    kode: 'D',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('buildings', buildings, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('buildings', null)
  },
}
