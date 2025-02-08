// db.config.ts
import mongoose from 'mongoose'
import { MONGODB_URI } from '../environment/environment.variables'

const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI || MONGODB_URI // URL de conexión
    await mongoose.connect(dbUri)
    console.log('Conexión a MongoDB exitosa')
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(1) // Detener la ejecución si la conexión falla
  }
}

export default connectDB
