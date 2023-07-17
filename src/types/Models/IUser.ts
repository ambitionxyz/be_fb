import { Moment } from "moment";
import * as mongoose from "mongoose";

export interface IUser extends Document {
  id?: string;
  // id(id: any, expires: Moment, RESET_PASSWORD: string): unknown;
  password: string;
  userName: string;
  sex: number | null;
  name: string;
  creationTime: string;
  surname: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  isActive: boolean | null;
  roleNames: string[];
  avatarPath: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

// export interface IUser extends IUserDocument {
//   isPasswordMatch(password: string): Promise<boolean>;
// }
// export interface IUserModel extends mongoose.Model<IUser> {
//   isEmailTaken(email: string, excludeUserId: string): Promise<boolean>;
// }

// export interface IUserCombine extends IUser, IUserModel {}
