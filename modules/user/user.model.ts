import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  username: string
  name: string
  created_at: string
  confirm_account: boolean
  confirmToken?: string
  confirmTokenExpires?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  role: unknown
  image: unknown
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: String, required: true },
    confirm_account: { type: Boolean },
    confirmToken: { type: String },
    confirmTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: {},
    image: {},
  },
  { versionKey: false }
)

export const User = mongoose.model<IUser>('Users', UserSchema)
