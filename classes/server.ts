import express from 'express'
import { SERVER_PORT } from '../config/environment/environment.variables'

export default class Server {
  public app: express.Application
  public port: number

  constructor() {
    this.app = express()
    this.port = SERVER_PORT
  }

  use(middleware: any) {
    this.app.use(middleware)
  }

  start(callback: Function) {
    this.app.listen(this.port, callback())
  }
}
