import { Model, DataTypes, Sequelize } from 'sequelize';

export default class WorkflowRun extends Model {
  public id!: number;
  public workflowId!: number;
  public userId!: number;
  public accountId!: number;
  public success!: boolean;
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
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        success: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'WorkflowRun',
        tableName: 'workflow_runs',
        underscored: true,
        updatedAt: false, // Runs are immutable events
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Workflow, {
      foreignKey: 'workflow_id',
      as: 'workflow',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.belongsTo(models.Account, {
      foreignKey: 'account_id',
      as: 'account',
    });
  }
}
