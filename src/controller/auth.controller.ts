import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import tokenService from "../services/tokenService";
import userService from "../services/userService";
import authService from "../services/authService";

class authController {
  register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await userService.createUser(req.body);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(httpStatus.CREATED).send({ user, tokens });
    }
  );

  login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const user = await authService.loginUserWithEmailAndPassword(
        email,
        password
      );
      const tokens = await tokenService.generateAuthTokens(user);
      res.send({ user, tokens });
    }
  );

  logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await authService.logout(req.body.refreshToken);
      res.status(httpStatus.NO_CONTENT).send();
    }
  );

  refreshTokens = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const tokens = await authService.refreshAuth(req.body.refreshToken);
      res.send({ ...tokens });
    }
  );

  resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      await authService.resetPassword(req.query.token, req.body.password);
      res.status(httpStatus.NO_CONTENT).send();
    }
  );
}

export = new authController();
