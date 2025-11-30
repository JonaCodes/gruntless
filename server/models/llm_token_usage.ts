import { Model, DataTypes, Sequelize } from 'sequelize';

export default class LlmTokenUsage extends Model {
  public id!: number;
  public accountId!: number;
  public userId!: number;
  public taskName!: string;
  public model!: string;
  public inputTokens!: number;
  public outputTokens!: number;
  public totalTokens!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
        taskName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        inputTokens: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        outputTokens: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
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
