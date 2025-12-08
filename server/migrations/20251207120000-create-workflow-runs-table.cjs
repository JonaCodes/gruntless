'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workflow_runs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workflow_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'workflows',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Indexes for efficient queries
    await queryInterface.addIndex('workflow_runs', ['user_id']);
    await queryInterface.addIndex('workflow_runs', ['workflow_id']);
    await queryInterface.addIndex('workflow_runs', ['account_id']);

    // Composite indexes for common query patterns
    await queryInterface.addIndex('workflow_runs', ['user_id', 'workflow_id']);
    await queryInterface.addIndex('workflow_runs', ['workflow_id', 'created_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('workflow_runs');
  },
};
