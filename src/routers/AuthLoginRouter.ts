import fs = require("fs");
import { BaseRouter } from "./BaseRouter";
// import AuthenticateController = require("../controller/AuthenticateController");

/**
 * @description AuthLoginRouter
 */
class AuthLoginRouter extends BaseRouter {
  // private _authenService = AuthenService;

  constructor() {
    super();
    this.init();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  protected init() {
    this.router.post(
      "/Authenticate"
      // validate(REQUIRED_FIELD_LOGIN),
      // AuthenticateController.authenticate
    );
  }
}

export = new AuthLoginRouter().router;
