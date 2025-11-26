import { Model, DataTypes, Sequelize } from 'sequelize';

export default class LlmTokenUsage extends Model {
  public id!: number;
  public account_id!: number;
  public user_id!: number;
  public task_name!: string;
  public model!: string;
  public input_tokens!: number;
  public output_tokens!: number;
  public total_tokens!: number;

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
        account_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        task_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        input_tokens: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        output_tokens: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        modelName: 'LlmTokenUsage',
        tableName: 'llm_token_usage',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}
