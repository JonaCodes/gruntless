'use strict';

// No account_id on purpose, because we want to allow sharing workflows between accounts, hence no RLS here
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workflow_shares', {
      id: {
        type: Sequelize.STRING(10),
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
      shared_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shared_with: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      accepted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('workflow_shares', ['workflow_id']);
    await queryInterface.addIndex('workflow_shares', ['shared_by']);
    await queryInterface.addIndex('workflow_shares', ['shared_with']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('workflow_shares');
  },
};
