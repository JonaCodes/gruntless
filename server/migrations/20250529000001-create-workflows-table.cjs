'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workflows', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      action_button_label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      est_saved_minutes: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      parent_workflow_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'workflows',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      root_workflow_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'workflows',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM(
          'validating',
          'validated',
          'clarifying',
          'building',
          'pending_user_approval',
          'approved',
          'rejected',
          'failed',
          'archived'
        ),
        allowNull: false,
        defaultValue: 'approved',
      },
      file_extracts: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      fields: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      execution: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('workflows', ['account_id']);
    await queryInterface.addIndex('workflows', ['user_id']);
    await queryInterface.addIndex('workflows', ['parent_workflow_id']);
    await queryInterface.addIndex('workflows', ['root_workflow_id']);

    // Add partial unique index: only enforce uniqueness when root_workflow_id IS NOT NULL
    // This allows multiple workflows with (user_id, NULL) but prevents duplicate forks
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_user_root_workflow
      ON workflows (user_id, root_workflow_id)
      WHERE root_workflow_id IS NOT NULL;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('workflows');
  },
};
