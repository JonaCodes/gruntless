import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Workflow extends Model {
  public id!: number;
  public accountId!: number;
  public userId!: number;
  public name!: string | null;
  public description!: string | null;
  public label!: string | null;
  // TODO: category will be FK to workflow_categories table
  public lastRun!: Date | null;
  public numRuns!: number;
  public actionButtonLabel!: string | null;
  public estSavedMinutes!: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Association types
  public versions?: any[];

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        label: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastRun: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        numRuns: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        actionButtonLabel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        estSavedMinutes: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Workflow',
        tableName: 'workflows',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.hasMany(models.WorkflowVersion, {
      foreignKey: 'workflow_id',
      as: 'versions',
    });
    this.hasMany(models.WorkflowMessage, {
      foreignKey: 'workflow_id',
      as: 'messages',
    });
    this.hasMany(models.WorkflowShare, {
      foreignKey: 'workflow_id',
      as: 'shares',
    });
    this.hasMany(models.WorkflowRun, {
      foreignKey: 'workflow_id',
      as: 'runs',
    });
  }
}
