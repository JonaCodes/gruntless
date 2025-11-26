import { Model, DataTypes, Sequelize } from 'sequelize';

export default class Event extends Model {
  public id!: number;
  public name!: string;
  public user_id!: number | null;
  public ip!: string | null;
  public data!: any | null;
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        ip: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        data: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}
