import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Account extends Model {
  public id!: number;
  public name!: string | null;
  public primaryContactEmail!: string;
  public provider!: string;
  public lastLogin!: Date;
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
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        primaryContactEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
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
