import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/db/db.config'
import User from '../user/user.model'

const Friendships = sequelize.define(
  'friendships',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user2_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'friendships',
    timestamps: false,
  }
)

Friendships.belongsTo(User, { foreignKey: 'user1_id', as: 'user1' })
Friendships.belongsTo(User, { foreignKey: 'user2_id', as: 'user2' })

export { Friendships }
