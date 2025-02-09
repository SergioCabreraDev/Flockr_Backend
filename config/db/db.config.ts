import { Sequelize } from 'sequelize'
import { POSTGRES_URI } from '../environment/environment.variables'

const dbUri = process.env.POSTGRES_URI || POSTGRES_URI // URL de conexión

const sequelize = new Sequelize(dbUri, {
  dialect: 'postgres',
  logging: false, 
})

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('\x1b[32m','Conexión a PostgreSQL exitosa')
  } catch (error) {
    console.log('\x1b[31m','Error al conectar a PostgreSQL:', error)
    process.exit(1)
  }
}

export { sequelize, connectDB }
