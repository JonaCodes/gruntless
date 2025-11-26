'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('llm_batch_tasks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      batch_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      custom_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      task_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'validating',
          'failed',
          'in_progress',
          'finalizing',
          'completed',
          'expired',
          'cancelling',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'validating',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('llm_batch_tasks', ['batch_id'], {
      unique: true,
    });
    await queryInterface.addIndex('llm_batch_tasks', ['custom_id']);
    await queryInterface.addIndex('llm_batch_tasks', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('llm_batch_tasks');
  },
};
