import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/db/db.config'
import { Server } from './server.model'

const ServerMember = sequelize.define(
  'ServerMember',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    server_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Server,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'server_members',
    timestamps: false,
  }
)

Server.hasMany(ServerMember, { foreignKey: 'server_id', onDelete: 'CASCADE' })
ServerMember.belongsTo(Server, { foreignKey: 'server_id' })

export { ServerMember }
