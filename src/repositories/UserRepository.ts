import { BaseRepository } from "./BaseRepository";
import { IUser } from "../types/Models/IUser";
import User from "../models/user";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User, "UserRepository");
  }

  async isEmailTaken(
    emailInput: string,
    excludeUserId: string
  ): Promise<boolean> {
    const user = await this._db.findOne({
      emailAddress: emailInput,
      _id: { $ne: excludeUserId },
    });
    return !!user;
  }

  async getUserByEmail(emailInput: string): Promise<IUser> {
    return this.findOne({ emailAddress: emailInput });
  }

  async getUserById(id: string): Promise<IUser> {
    return this.findOne({ id: id });
  }

  async updateUserById(userId: string, updateBody): Promise<IUser> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (
      updateBody.email &&
      (await this.isEmailTaken(updateBody.email, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    const userUpdated = await this.update(userId, updateBody);
    return userUpdated;
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await this.delete(userId);
  }
}

export = new UserRepository();
