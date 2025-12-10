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

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add parent and root workflow references
    await queryInterface.addColumn('workflows', 'parent_workflow_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'workflows',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('workflows', 'root_workflow_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'workflows',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add version tracking
    await queryInterface.addColumn('workflows', 'version', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    // Add status field from WorkflowVersion
    await queryInterface.addColumn('workflows', 'status', {
      type: Sequelize.ENUM(...WORKFLOW_VERSION_STATUSES),
      allowNull: false,
      defaultValue: 'approved',
    });

    // Add JSONB fields from WorkflowVersion
    await queryInterface.addColumn('workflows', 'file_extracts', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: '[]',
    });

    await queryInterface.addColumn('workflows', 'fields', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn('workflows', 'execution', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn('workflows', 'rejection_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Remove denormalized fields (will use workflow_runs as source of truth)
    await queryInterface.removeColumn('workflows', 'num_runs');
    await queryInterface.removeColumn('workflows', 'last_run');

    // Add indexes
    await queryInterface.addIndex('workflows', ['parent_workflow_id'], {
      name: 'idx_workflows_parent_id',
    });

    await queryInterface.addIndex('workflows', ['root_workflow_id'], {
      name: 'idx_workflows_root_id',
    });

    await queryInterface.addIndex('workflows', ['status'], {
      name: 'idx_workflows_status',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('workflows', 'idx_workflows_status');
    await queryInterface.removeIndex('workflows', 'idx_workflows_root_id');
    await queryInterface.removeIndex('workflows', 'idx_workflows_parent_id');

    // Restore denormalized fields
    await queryInterface.addColumn('workflows', 'num_runs', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('workflows', 'last_run', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Remove columns
    await queryInterface.removeColumn('workflows', 'rejection_reason');
    await queryInterface.removeColumn('workflows', 'execution');
    await queryInterface.removeColumn('workflows', 'fields');
    await queryInterface.removeColumn('workflows', 'file_extracts');
    await queryInterface.removeColumn('workflows', 'status');
    await queryInterface.removeColumn('workflows', 'version');
    await queryInterface.removeColumn('workflows', 'root_workflow_id');
    await queryInterface.removeColumn('workflows', 'parent_workflow_id');
  },
};
