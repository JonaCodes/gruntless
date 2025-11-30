import { Model, DataTypes, Sequelize } from 'sequelize';
import { WORKFLOW_MESSAGE_ROLE } from '@shared/consts/workflows';

export default class WorkflowMessage extends Model {
  public id!: number;
  public workflowId!: number;
  public accountId!: number;
  public role!: keyof typeof WORKFLOW_MESSAGE_ROLE;
  public content!: string;
  public createdAt!: Date;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        workflowId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(...Object.values(WORKFLOW_MESSAGE_ROLE)),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'WorkflowMessage',
        tableName: 'workflow_messages',
        underscored: true,
        updatedAt: false, // Messages are immutable
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Workflow, { foreignKey: 'workflow_id' });
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }
}
