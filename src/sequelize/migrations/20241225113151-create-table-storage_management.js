/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storage_managements', {
      id: {
        allowNull: false,
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      unit_id: {
        type: Sequelize.STRING(36),
      },
      building_id: {
        type: Sequelize.STRING(36),
      },
      floor_id: {
        type: Sequelize.STRING(36),
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
    await queryInterface.dropTable('storage_managements')
  },
}
