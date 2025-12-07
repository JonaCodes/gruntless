import { Model, DataTypes, Sequelize } from 'sequelize';

export default class WorkflowShare extends Model {
  public id!: string;
  public workflowId!: number;
  public sharedBy!: number;
  public sharedWith!: number | null;
  public acceptedAt!: Date | null;
  public createdAt!: Date;

  // No account_id on purpose, because we want to allow sharing workflows between accounts, hence no RLS here
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.STRING(10),
          primaryKey: true,
        },
        workflowId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sharedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        sharedWith: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        acceptedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'WorkflowShare',
        tableName: 'workflow_shares',
        underscored: true,
        updatedAt: false,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Workflow, {
      foreignKey: 'workflow_id',
      as: 'workflow',
    });
    this.belongsTo(models.User, { foreignKey: 'shared_by', as: 'sharer' });
    this.belongsTo(models.User, { foreignKey: 'shared_with', as: 'recipient' });
  }
}
