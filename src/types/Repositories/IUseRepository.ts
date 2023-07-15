import { IUser } from "../Models/IUser";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  isEmailTaken(emailInput: string, excludeUserId: string): Promise<boolean>;
  getUserByEmail(emailInput: string): Promise<IUser>;
}
