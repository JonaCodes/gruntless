import { Model, DataTypes, Sequelize } from 'sequelize';

export default class User extends Model {
  public id!: number;
  public supabaseId!: string;
  public email!: string;
  public fullName!: string | null;
  public avatarUrl!: string | null;
  public provider!: string;
  public lastLogin!: Date;
  public accountId!: number;
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
          references: {
            model: 'accounts',
            key: 'id',
          },
        },
        supabaseId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        avatarUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        provider: {
          type: DataTypes.ENUM('email', 'google', 'apple'),
          allowNull: false,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Account, { foreignKey: 'account_id' });
    this.hasMany(models.Workflow, { foreignKey: 'user_id', as: 'Workflows' });
  }
}
