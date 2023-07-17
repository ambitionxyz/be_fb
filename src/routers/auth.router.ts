import fs = require("fs");
import { BaseRouter } from "./BaseRouter";
import authController = require("../controller/auth.controller");

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
    this.router.get("/demo", (req, res) => {
      res.status(200).json("demo");
    });
    this.router.post("/register", authController.register);
    this.router.post("/login", authController.login);
    this.router.post("/logout", authController.logout);
    this.router.post("/refresh-tokens", authController.refreshTokens);
  }
}

export = new AuthLoginRouter().router;
