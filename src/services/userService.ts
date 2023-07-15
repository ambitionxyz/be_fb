import httpStatus from "http-status";
import UserRepository from "../repositories/UserRepository";
import { IUserRepository } from "../types/Repositories/IUseRepository";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../types/Models/IUser";

class UserService {
  private _repository: IUserRepository = UserRepository;

  async createUser(userBody) {
    if (await this._repository.isEmailTaken(userBody.email, "")) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }
    return this._repository.create(userBody);
  }

  async getUserByEmail(emailInput: string): Promise<IUser> {
    return this._repository.getUserByEmail(emailInput);
  }
}

export = new UserService();
