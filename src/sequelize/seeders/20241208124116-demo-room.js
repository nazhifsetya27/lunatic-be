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
  {
    id: '63e192fd-c5ab-4a65-8b55-1d5f2bb8e5c9',
    name: 'Ruang Sekretaris SRM Opsis',
    kode: '006',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '09388b6a-c044-4880-a4d8-55d10ee774df',
    name: 'Ruang Sekretaris SRM TES',
    kode: '007',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bd086d9a-a5fd-47ed-b921-8ae8582b11ae',
    name: 'Ruang Server',
    kode: '008',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2ece1d2e-7bd0-4631-8844-77a9ec7142ad',
    name: 'Ruang SRM Opsis',
    kode: '009',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '23b45014-3d75-48eb-88b2-255072db8f5a',
    name: 'Ruang SRM TES',
    kode: '010',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '24b091a3-3991-41ff-90dc-21c3cbd3ac97',
    name: 'Ruang Telkom',
    kode: '011',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bdc5a4a4-88f5-4815-9d97-b577d0a7d8c5',
    name: 'Toilet Pria',
    kode: '012',
    lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '9c16336e-e7af-426d-9ce3-72c8dcef3792',
    name: 'Toilet Wanita',
    kode: '013',
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
