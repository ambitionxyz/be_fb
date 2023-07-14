import dotenv from "dotenv";
import { connect, connection } from "mongoose";
import { Server } from "./server";
import config from "./config/config";
/**
 * Application class.
 * @description Handle init config and components.
 */

export class Application {
  server: Server;

  init() {
    this.initServer();
    this.connectDB();
  }

  private initServer() {
    this.server = new Server();
  }
  private async connectDB() {
    await connect(config.mongoose.url, config.mongoose.options);
    console.log("connect DB");
  }
  start() {
    (async (port = process.env.APP_PORT || 5000) => {
      this.server.app.listen(port, () =>
        console.log(`> Listening on port ${port}`)
      );
      this.server.app.use("/api", this.server.router);
    })();
  }
}
