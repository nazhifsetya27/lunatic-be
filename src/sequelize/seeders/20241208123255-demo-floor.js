const floors = [
  {
    id: '44f35762-6723-40fb-b453-8163c8642e6a',
    name: 'Lantai 0',
    kode: '00',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '904b1132-f7dd-49fb-b4dd-c32a5461ad68',
    name: 'Lantai 1',
    kode: '01',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '8c642c01-70ce-41d9-97b2-e6ab3965b3ae',
    name: 'Lantai 2',
    kode: '02',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '9c59381b-9067-430b-ba96-9fd46d7527b1',
    name: 'Lantai 3',
    kode: '03',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'bb977db6-a8c3-4f12-8b08-785e91ced924',
    name: 'Lantai 4',
    kode: '04',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c19c6071-1019-404b-abfb-48efb5826a49',
    name: 'Lantai 5',
    kode: '05',
    gedung_id: '8317d35f-a64e-49be-8c4f-b31b4d66f2a0', // gedung opsis
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('floors', floors, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('floors', null)
  },
}
