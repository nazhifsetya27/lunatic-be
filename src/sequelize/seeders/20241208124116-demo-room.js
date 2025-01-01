const rooms = [
  // -------- lantai 0 gedung opsis --------
  {
    id: 'df333f66-a658-4ea3-a49d-200b726223ed',
    name: 'Lobby',
    kode: '001',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'db422d7a-8c5d-4aa0-be08-451ffe79645e',
    name: 'Musholla',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ea4f0b23-0615-4c8f-9893-bdcad6ad678f',
    name: 'Pantry',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'de4bd93a-5ffb-44dd-bb35-ef8987e4bd77',
    name: 'Ruang Panel Elka',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'e18e5454-dda5-49f2-96b1-8360d729b5e3',
    name: 'Ruang SCADA',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '63e192fd-c5ab-4a65-8b55-1d5f2bb8e5c9',
    name: 'Ruang Sekretaris SRM Opsis',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '09388b6a-c044-4880-a4d8-55d10ee774df',
    name: 'Ruang Sekretaris SRM TES',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bd086d9a-a5fd-47ed-b921-8ae8582b11ae',
    name: 'Ruang Server',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2ece1d2e-7bd0-4631-8844-77a9ec7142ad',
    name: 'Ruang SRM Opsis',
    kode: '009',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '23b45014-3d75-48eb-88b2-255072db8f5a',
    name: 'Ruang SRM TES',
    kode: '010',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '24b091a3-3991-41ff-90dc-21c3cbd3ac97',
    name: 'Ruang Telkom',
    kode: '011',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bdc5a4a4-88f5-4815-9d97-b577d0a7d8c5',
    name: 'Toilet Pria',
    kode: '012',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '9c16336e-e7af-426d-9ce3-72c8dcef3792',
    name: 'Toilet Wanita',
    kode: '013',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },

  // -------- lantai 1 gedung opsis --------

  {
    id: 'a835eb7d-e048-4563-81dd-1932157e543b',
    name: 'Pantry',
    kode: '001',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '314d0a59-1eb6-44bb-a235-90d3f88742c5',
    name: 'Ruang Dalop',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '4fb28b81-e922-45fa-b0df-a7ac51b68d6a',
    name: 'Ruang Database',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2fad4e65-4379-4cd2-b248-20a3bb8087f3',
    name: 'Ruang Dispatcher',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'b8155d5b-790b-4ede-b321-75dd63cd1f2a',
    name: 'Ruang Manager Opsis',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c67cfc91-a0eb-40b5-a81e-9032811e1f61',
    name: 'Ruang ROH',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'd1057f9f-b879-4882-b5ce-e15043b9fbe8',
    name: 'Ruang ROM',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '421f7806-c748-4d6e-b2c2-6110bd283c25',
    name: 'Ruang Voltage',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '96970575-bf33-4179-8c2a-aa9f722c23f3',
    name: 'Toilet Pria',
    kode: '009',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'eb3a36be-dcf2-43f2-97a9-097c02474bf6',
    name: 'Toilet Wanita',
    kode: '010',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },

  // -------- lantai 2 gedung opsis --------
  // {
  //   id: 'eb3a36be-dcf2-43f2-97a9-097c02474bf6',
  //   name: 'Pantry',
  //   kode: '001',
  //   // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },

  {
    id: '77f8393d-d27f-4352-8e7e-153ea684480a',
    name: 'Ruang Crisis Center',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '6f98a1d6-b11a-4e9c-88da-8ebea942fe9b',
    name: 'Ruang Mezanin',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'efbf3db0-4e87-4a69-a0a6-0c49f66766f9',
    name: 'Ruang Manager Renop',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'a7c0f7cf-0634-42d8-917e-ab2440b56345',
    name: 'Ruang Manager SCADA',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '8aed193c-adc8-46c5-9c67-bdc914626425',
    name: 'Ruang Renkit',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2e9d693e-89f0-407b-a4b7-8611c702f033',
    name: 'Ruang Renlur',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '9fa2e16a-f10a-4e30-afb0-7845a0453ea1',
    name: 'Ruang Renop',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  // {
  //   id: '9fa2e16a-f10a-4e30-afb0-7845a0453ea1',
  //   name: 'Toilet Pria',
  //   kode: '009',
  //   // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  // {
  //   id: '9fa2e16a-f10a-4e30-afb0-7845a0453ea1',
  //   name: 'Toilet Wanita',
  //   kode: '010',
  //   // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },

  // -------- lantai 3 gedung opsis --------

  // {
  //   id: 'eb3a36be-dcf2-43f2-97a9-097c02474bf6',
  //   name: 'Pantry',
  //   kode: '001',
  //   // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },
  {
    id: 'f31419cc-97e8-4826-ba9b-fb6f78714215',
    name: 'Ruang Metering',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '10e6bfa3-aa46-404b-a49a-61517012d896',
    name: 'Ruang Rapat Safety',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '15fac028-535b-46b3-b3eb-90ddc1be0b84',
    name: 'Ruang Settlement',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bb00b0b9-cbf9-4daa-9b00-24b7d3fb47bf',
    name: 'Toilet Pria',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '65531c67-5960-46ef-8f27-041d0280e072',
    name: 'Toilet Wanita',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'd6541322-e8d8-4052-a0e2-ce9c6e1b34ee',
    name: 'Selasar',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '5602c0e5-b7de-4ff9-b077-7145857d3b6e',
    name: 'Ruang Laktasi',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3de38be7-2008-4e6e-b9ae-98595d6bf389',
    name: 'Ruang MSB TE',
    kode: '009',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '78dd1f68-673c-4f0c-9d13-96fa3298d2e1',
    name: 'Ruang MSB Settlement',
    kode: '010',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },

  // -------- lantai 4 gedung opsis --------

  {
    id: '273248fa-89af-4c06-a969-cd2a762d66e4',
    name: 'Ruang Rapat Outstanding',
    kode: '001',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '16da9ac6-1d63-4b43-8cbf-420bc6629885',
    name: 'Ruang Tunggu Tamu',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '6098fc66-a7d7-4386-8942-94a2c79588a2',
    name: 'Ruang Sekretaris GM',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '054146d6-a3ea-4850-8296-1fd49db48bd0',
    name: 'Ruang GM',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '68ea8343-9a16-43e5-8062-dcee4311b39d',
    name: 'Toilet GM',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'ec2505c9-6e86-49da-b70f-0621c9a6fd1f',
    name: 'Ruang Istirahat GM',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '824e3d60-6550-4028-98be-2c3395c7800c',
    name: 'Ruang Rapat GM',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '948d1197-f962-4897-9560-b556c918b06e',
    name: 'Pantry',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '04d79658-af66-447c-a174-2d5989f9ed4b',
    name: 'Toilet Pria',
    kode: '009',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'f9f85e78-7fdc-4331-80f4-2150ea3efede',
    name: 'Toilet Pria & Wanita',
    kode: '010',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '8b08bb33-007d-452c-af10-a2b8dadf0c17',
    name: 'Ruang Arsip',
    kode: '011',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3c2dd0dd-6c49-4a28-8227-d75f712ae598',
    name: 'Selasar',
    kode: '012',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },

  // -------- lantai 5 gedung opsis --------
  // {
  //   id: '3c2dd0dd-6c49-4a28-8227-d75f712ae598',
  //   name: 'Lobby',
  //   kode: '001',
  //   // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
  //   created_at: new Date(),
  //   updated_at: new Date(),
  // },

  {
    id: '37fe83c2-c165-4488-bac9-f124110c76bd',
    name: 'Pantry',
    kode: '002',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'af560afd-e2bc-451b-bd43-5c74807d5af4',
    name: 'Perpustakaan',
    kode: '003',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '79be257e-70f6-4e43-b6a6-dfae994a4300',
    name: 'Ruang Load Flow',
    kode: '004',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '825755dd-ef95-439e-9fce-8e6270c4d4d6',
    name: 'Ruang DTS 1',
    kode: '005',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '31d46bf2-3009-43d8-9f97-ccd14542d372',
    name: 'Ruang DTS 2',
    kode: '006',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'f483a9d0-c4cd-4aae-b9a6-6ac8be0b2864',
    name: 'Ruang Server DTS',
    kode: '007',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '67165a12-8997-41ca-806b-24a28de16908',
    name: 'Selasar',
    kode: '008',
    // lantai_id: '44f35762-6723-40fb-b453-8163c8642e6a', // lantai 0
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
