'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add partial unique index: only enforce uniqueness when root_workflow_id IS NOT NULL
    // This allows multiple workflows with (user_id, NULL) but prevents duplicate forks
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX unique_user_root_workflow
      ON workflows (user_id, root_workflow_id)
      WHERE root_workflow_id IS NOT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS unique_user_root_workflow;
    `);
  },
};
