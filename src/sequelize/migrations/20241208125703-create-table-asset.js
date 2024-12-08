/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assets', {
      id: {
        allowNull: false,
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kode: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      category: {
        type: Sequelize.STRING(50),
        comment: ['Furniture', 'Elektronik', 'Umum'],
      },
      quantity: {
        type: Sequelize.INTEGER(),
        unique: true,
      },
      room_id: {
        type: Sequelize.STRING(36),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assets')
  },
}
