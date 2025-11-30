import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Workflow extends Model {
  public id!: number;
  public account_id!: number;
  public user_id!: number;
  public name!: string | null;
  public description!: string | null;
  public label!: string | null;
  public created_at!: Date;
  public updated_at!: Date;

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
  }
}
