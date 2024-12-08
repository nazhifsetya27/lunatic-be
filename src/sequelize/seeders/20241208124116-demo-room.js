const rooms = [
  {
    id: 'df333f66-a658-4ea3-a49d-200b726223ed',
    name: 'Lobby',
    kode: '001',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    name: 'Musholla',
    kode: '002',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ea4f0b23-0615-4c8f-9893-bdcad6ad678f',
    name: 'Pantry',
    kode: '003',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'de4bd93a-5ffb-44dd-bb35-ef8987e4bd77',
    name: 'Ruang Panel Elka',
    kode: '004',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3',
    name: 'Ruang SCADA',
    kode: '005',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('rooms', rooms, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rooms', null)
  },
}
