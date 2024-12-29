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
  {
    id: '849aec34-c475-42d2-bc3e-e8a52b61a564',
    name: 'Kursi Rapat',
    kode: 'F2',
    category: 'Furniture',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '71a5ae62-1368-4a6a-a362-b22d918ac04f',
    name: 'Kursi Umum',
    kode: 'F3',
    category: 'Furniture',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '5c41c0ba-1968-4de4-9706-6a6e9b3f3e7b',
    name: 'Laci/Drawer',
    kode: 'F4',
    category: 'Furniture',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bdd06ca4-0c23-4325-bf48-8f7230392e20',
    name: 'Lemari',
    kode: 'F5',
    category: 'Furniture',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'afda7e81-31e8-459e-87a4-920b5ab177aa',
    name: 'AC',
    kode: 'E1',
    category: 'Elektronik',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'e5ca64bd-664f-491b-8036-fe0bebed9922',
    name: 'Air Fryer',
    kode: 'E2',
    category: 'Elektronik',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '48b5213d-44db-4fcd-a4c6-e4ce55b6f65d',
    name: 'Air Purifier',
    kode: 'E3',
    category: 'Elektronik',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '9c23a6f3-fd63-43b8-bd31-59132525eb66',
    name: 'CCTV',
    kode: 'E4',
    category: 'Elektronik',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '0ecfe0ca-2392-416b-9ace-92d845f5e056',
    name: 'Clip On',
    kode: 'E5',
    category: 'Elektronik',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'dec730a1-0ded-4616-a1dc-b5ade37b52c5',
    name: 'Akrilik',
    kode: 'U1',
    category: 'Umum',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '5a50c4f3-a172-40b8-9a75-e082d15eb2aa',
    name: 'APAR',
    kode: 'U2',
    category: 'Umum',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'f8d93eff-f122-4a56-a20a-ed791b86996f',
    name: 'APAT',
    kode: 'U3',
    category: 'Umum',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2e5ed230-c71e-4b1b-a554-d1d81be5e57d',
    name: 'Aquarium',
    kode: 'U4',
    category: 'Umum',
    quantity: 1,
    // room_id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3', // Ruangan SCADA
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3dff79dd-942d-4bf6-bef7-dc04242b41dd',
    name: 'Bonpet',
    kode: 'U5',
    category: 'Umum',
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
