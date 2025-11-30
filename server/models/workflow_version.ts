import { Model, DataTypes, Sequelize } from 'sequelize';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import type {
  FileExtract,
  WorkflowField,
  WorkflowExecution,
} from '@shared/types/workflows';

const STATUS_VALUES = Object.values(WORKFLOW_VERSION_STATUS);

export default class WorkflowVersion extends Model {
  public id!: number;
  public workflowId!: number;
  public accountId!: number;
  public version!: number;
  public status!: keyof typeof WORKFLOW_VERSION_STATUS;
  public isActive!: boolean;
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
        workflowId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        accountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        version: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(...STATUS_VALUES),
          allowNull: false,
          defaultValue: WORKFLOW_VERSION_STATUS.VALIDATING,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        fileExtracts: {
          type: DataTypes.JSONB,
          allowNull: false,
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
        modelName: 'WorkflowVersion',
        tableName: 'workflow_versions',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Workflow, { foreignKey: 'workflow_id' });
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
  }
}
