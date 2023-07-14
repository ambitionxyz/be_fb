import express from "express";
import MasterRouter from "./routers/MasterRouter";

export class Server {
  public app = express();

  public router = MasterRouter;
}
