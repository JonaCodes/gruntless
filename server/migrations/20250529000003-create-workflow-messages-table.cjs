'use strict';

const MESSAGE_ROLES = ['user', 'assistant'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workflow_messages', {
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
      role: {
        type: Sequelize.ENUM(...MESSAGE_ROLES),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('workflow_messages', ['workflow_id']);
    await queryInterface.addIndex('workflow_messages', ['account_id']);
    
    // For fetching messages in order
    await queryInterface.addIndex('workflow_messages', ['workflow_id', 'created_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('workflow_messages');
  },
};
