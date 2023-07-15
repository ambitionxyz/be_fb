import { BaseRepository } from "./BaseRepository";
import Token from "../models/token";
import { IToken } from "../types/Models/IToken";
import config from "../config/config";
import moment from "moment";
import jwt from "jsonwebtoken";
import { tokenTypes } from "../config/tokens";
import userService from "../services/userService";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class TokenRepository extends BaseRepository<IToken> {
  constructor() {
    super(Token, "UserRepository");
  }

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
    const tokenDoc = await Token.create({
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
    const tokenDoc = await Token.findOne({
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
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );
    await this.saveToken(
      refreshToken,
      user.id,
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
}
export = new TokenRepository();
