import { Model, DataTypes, Sequelize } from 'sequelize';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import type {
  FileExtract,
  WorkflowField,
  WorkflowExecution,
} from '@shared/types/workflows';

const STATUS_VALUES = Object.values(WORKFLOW_VERSION_STATUS);

export default class Workflow extends Model {
  public id!: number;
  public accountId!: number;
  public userId!: number;
  public name!: string | null;
  public description!: string | null;
  public label!: string | null;
  // TODO: category will be FK to workflow_categories table
  public actionButtonLabel!: string | null;
  public estSavedMinutes!: number | null;
  public parentWorkflowId!: number | null;
  public rootWorkflowId!: number | null;
  public version!: number;
  public status!: keyof typeof WORKFLOW_VERSION_STATUS;
  public fileExtracts!: FileExtract[];
  public fields!: WorkflowField[] | null;
  public execution!: WorkflowExecution | null;
  public rejectionReason!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;

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
        actionButtonLabel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        estSavedMinutes: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        parentWorkflowId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        rootWorkflowId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        status: {
          type: DataTypes.ENUM(...STATUS_VALUES),
          allowNull: false,
          defaultValue: WORKFLOW_VERSION_STATUS.APPROVED,
        },
        fileExtracts: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        fields: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        execution: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        rejectionReason: {
          type: DataTypes.TEXT,
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
