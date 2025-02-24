import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/db/db.config'

const Server = sequelize.define(
  'Server',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'servers',
    timestamps: false,
  }
)

export { Server }
