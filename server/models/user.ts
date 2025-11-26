import { Model, DataTypes, Sequelize } from 'sequelize';

export default class User extends Model {
  public id!: number;
  public supabase_id!: string;
  public email!: string;
  public full_name!: string | null;
  public avatar_url!: string | null;
  public provider!: string;
  public last_login!: Date;

  static initialize(sequelize: Sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        supabase_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        full_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        avatar_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        provider: {
          type: DataTypes.ENUM('email', 'google', 'apple'),
          allowNull: false,
        },
        last_login: {
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
  }
}
