import sequelize from '../config/database';
import User from './user';
import Account from './account';
import LlmTokenUsage from './llm_token_usage';
import Event from './event';
import Workflow from './workflow';
import WorkflowVersion from './workflow_version';
import WorkflowMessage from './workflow_message';
import WorkflowShare from './workflow_share';

const models = {
  User,
  Account,
  LlmTokenUsage,
  Event,
  Workflow,
  WorkflowVersion,
  WorkflowMessage,
  WorkflowShare,
};

Object.values(models).forEach((model) => {
  if (typeof model.initialize === 'function') {
    model.initialize(sequelize);
  }
});

Object.values(models).forEach((model) => {
  if ('associate' in model && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models;
