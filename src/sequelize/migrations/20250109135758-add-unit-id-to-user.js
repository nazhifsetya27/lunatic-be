'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try {
      await queryInterface.addColumn('users', 'unit_id', {
        allowNull: true,
        type: Sequelize.STRING,
      })
    } catch (error) {
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    try {
      await queryInterface.removeColumn('users', 'unit_id', {
        allowNull: true,
        type: Sequelize.STRING,
      })
    } catch (error) {
      throw error
    }
  },
}
