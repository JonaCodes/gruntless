import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Account extends Model {
  public id!: number;
  public name!: string | null;
  public primary_contact_email!: string;
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
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        primary_contact_email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
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
        modelName: 'Account',
        tableName: 'accounts',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.User, { foreignKey: 'account_id' });
  }
}
