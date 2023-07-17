import { BaseRouter } from "./BaseRouter";
import cors from "cors";
import bodyParser = require("body-parser");
import httpStatus = require("http-status");
import { errorConverter, errorHandler } from "../middlewares/error";
import { ApiError } from "../utils/ApiError";
import helmet from "helmet";
import passport = require("passport");
import { jwtStrategy } from "../config/passport";

import AuthLoginRouter = require("./auth.router");

class MasterRouter extends BaseRouter {
  constructor() {
    super();
    this.configure();

    this.init();
  }

  private configure() {
    this.router.use(cors());

    this.router.use(bodyParser.json()); // to support JSON-encoded bodies

    this.router.use(
      bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
      })
    );

    this.router.use(helmet());

    this.router.use(passport.initialize());
    passport.use("jwt", jwtStrategy);
  }
  /**
   * Connect routes to their matching routers.
   */
  protected init() {
    this.router.use("/TokenAuth", AuthLoginRouter);
    // send back a 404 error for any unknown api request
    this.router.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    });
    // convert error to ApiError, if needed
    this.router.use(errorConverter);

    // handle error
    this.router.use(errorHandler);
  }
}

export = new MasterRouter().router;
