import { Model, DataTypes, Sequelize } from 'sequelize';

export default class LlmBatchTask extends Model {
  public id!: number;
  public batch_id!: string;
  public custom_id!: string;
  public model!: string;
  public task_name!: string;
  public status!:
    | 'validating'
    | 'failed'
    | 'in_progress'
    | 'finalizing'
    | 'completed'
    | 'expired'
    | 'cancelling'
    | 'cancelled';

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        batch_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        task_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        custom_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
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
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'LlmBatchTask',
        tableName: 'llm_batch_tasks',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    // No associations needed for now
  }
}
