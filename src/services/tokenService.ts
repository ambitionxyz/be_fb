import moment from "moment";
import jwt from "jsonwebtoken";
import TokenRepository from "../repositories/TokenRepository";
import { ITokenRepository } from "../types/Repositories/ITokenRepository";
import config from "../config/config";
import { tokenTypes } from "../config/tokens";
import userService from "./userService";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { IToken } from "../types/Models/IToken";

class TokenService {
  private _repository: ITokenRepository = TokenRepository;

  async generateToken(userId, expires, type, secret = config.jwt.secret) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  }

  async saveToken(token, userId, expires, type, blacklisted = false) {
    const tokenDoc = await this._repository.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  }
  async verifyToken(token, type) {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await this._repository.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
  }

  async generateAuthTokens(user) {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = await this.generateToken(
      user._id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );

    console.log({ accessToken });

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = await this.generateToken(
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    await this.saveToken(
      refreshToken,
      user._id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  async generateResetPasswordToken(email) {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No users found with this email"
      );
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes"
    );
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      tokenTypes.RESET_PASSWORD
    );
    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      tokenTypes.RESET_PASSWORD
    );
    return resetPasswordToken;
  }

  async findOne(field: Object): Promise<any> {
    const token = await this._repository.findOne(field);
    if (token) {
      return token;
    }
    return {};
  }

  async delete(id): Promise<void> {
    const token = await this._repository.findOne({ _id: id });
    if (!token) {
      throw new ApiError(httpStatus.NOT_FOUND, "No token found");
    }
    await this._repository.delete(id);
  }

  async deleteMany(options): Promise<void> {
    await this.deleteMany(options);
  }
}

export = new TokenService();
