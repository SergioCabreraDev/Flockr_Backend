import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../../config/db/db.config'

interface UserAttributes {
  id: string
  username: string
  email: string
  password_hash: string
  avatar_url?: string // Opcional
  created_at: Date
  confirm_account?: boolean
  confirm_token?: string | null
  confirm_tokenexpires?: Date | null
  reset_passwordtoken?: string | null
  reset_passwordexpires?: Date | null
}

// Opcional, para permitir atributos al crear
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Modelo de Sequelize
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string
  public username!: string
  public email!: string
  public password_hash!: string
  public avatar_url?: string
  public created_at!: Date
  public confirm_account?: boolean
  public confirm_token?: string | null
  public confirm_tokenexpires?: Date | null
  public reset_passwordtoken?: string | null
  public reset_passwordexpires?: Date | null

  // Timestamps automáticos
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    confirm_account: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    confirm_token: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    confirm_tokenexpires: {
      type: DataTypes.DATE, // Cambiado a DataTypes.DATE
      allowNull: true,
    },
    reset_passwordtoken: {
      type: DataTypes.CHAR,
      allowNull: true,
    },
    reset_passwordexpires: {
      type: DataTypes.DATE, // Cambiado a DataTypes.DATE
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false, // Desactiva timestamps automáticos si no tienes `updatedAt`
  }
)

export default User
