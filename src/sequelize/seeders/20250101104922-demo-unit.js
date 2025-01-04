const units = [
  {
    id: '26e1ffb0-c205-4d68-a4d3-b92b9087525e',
    name: 'UIP2B Jamali',
    kode: '3301',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '37c63e48-fd2b-4ac2-b431-a178b3e05434',
    name: 'UP2B DKI Jakarta dan Banten',
    kode: '3311',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'a6e53593-a0f8-4acd-a5df-764e4c77d591',
    name: 'UP2B Jawa Barat',
    kode: '3312',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '971c6f45-caf1-4ec0-8ccd-9002b5e22c81',
    name: 'UP2B Jawa Tengah & DIY',
    kode: '3313',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 'c46ff9bb-cee9-48a7-b568-d3f7c19c3ccd',
    name: 'UP2B Jawa Timur',
    kode: '3314',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '89727fe8-6b97-40f2-b7f4-0eb4e2821e2a',
    name: 'UP2B Bali',
    kode: '3315',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('units', units, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('units', null)
  },
}
