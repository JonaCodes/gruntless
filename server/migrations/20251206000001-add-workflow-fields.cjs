'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('workflows', 'last_run', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('workflows', 'num_runs', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('workflows', 'action_button_label', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('workflows', 'est_saved_minutes', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('workflows', 'last_run');
    await queryInterface.removeColumn('workflows', 'num_runs');
    await queryInterface.removeColumn('workflows', 'action_button_label');
    await queryInterface.removeColumn('workflows', 'est_saved_minutes');
  },
};
