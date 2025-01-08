/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_adjustment_inventories', {
      id: {
        allowNull: false,
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      stock_adjustment_id: {
        type: Sequelize.STRING(36),
      },
      asset_id: {
        type: Sequelize.STRING(36),
      },
      previous_condition_id: {
        type: Sequelize.STRING(36),
      },
      current_condition_id: {
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
    await queryInterface.dropTable('stock_adjustment_inventories')
  },
}
