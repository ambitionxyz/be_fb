import httpStatus from "http-status";
import tokenService from "./tokenService";
import userService from "./userService";
import { ApiError } from "../utils/ApiError";
import { tokenTypes } from "../config/tokens";

class AuthService {
  loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    return user;
  };

  logout = async (refreshToken) => {
    const refreshTokenDoc = await tokenService.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    console.log({ refreshTokenDoc });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found");
    }
    await tokenService.delete(refreshTokenDoc._id);
    // await refreshTokenDoc.remove();
  };

  refreshAuth = async (refreshToken) => {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(
        refreshToken,
        tokenTypes.REFRESH
      );
      console.log({ refreshTokenDoc });
      const user = await userService.getUserById(
        refreshTokenDoc.user.toString()
      );
      console.log({ user });
      if (!user) {
        throw new Error();
      }
      await tokenService.delete(refreshTokenDoc.id);
      // await refreshTokenDoc.remove();

      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }
  };

  resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await tokenService.verifyToken(
        resetPasswordToken,
        tokenTypes.RESET_PASSWORD
      );
      const user = await userService.getUserById(
        resetPasswordTokenDoc.user.toString()
      );
      if (!user) {
        throw new Error();
      }
      await userService.updateUserById(user.id, { password: newPassword });
      await tokenService.deleteMany({
        user: user.id,
        type: tokenTypes.RESET_PASSWORD,
      });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
    }
  };
}

export = new AuthService();
