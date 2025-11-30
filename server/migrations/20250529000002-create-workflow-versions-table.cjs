'use strict';

const WORKFLOW_VERSION_STATUSES = [
  'validating',
  'validated',
  'clarifying',
  'building',
  'pending_user_approval',
  'approved',
  'rejected',
  'failed',
  'archived',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workflow_versions', {
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
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(...WORKFLOW_VERSION_STATUSES),
        allowNull: false,
        defaultValue: 'validating',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      file_extracts: {
        type: Sequelize.JSONB,
        allowNull: false,
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

    await queryInterface.addIndex('workflow_versions', ['workflow_id']);
    await queryInterface.addIndex('workflow_versions', ['account_id']);
    await queryInterface.addIndex('workflow_versions', ['status']);
    await queryInterface.addIndex('workflow_versions', ['is_active']);

    // Composite index for finding active version of a workflow
    await queryInterface.addIndex('workflow_versions', [
      'workflow_id',
      'is_active',
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('workflow_versions');
  },
};
