import { Request, Response, NextFunction } from "express";
import AuthenService from "../services/AuthenService";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
class AuthenticateController {
  authenticate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await AuthenService.authen(req.body);
      return res.status(httpStatus.OK).json(result);
    }
  );
}

export = new AuthenticateController();
