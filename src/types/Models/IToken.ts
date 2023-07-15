import { Document, Schema, Types } from "mongoose";

enum TokenTypes {
  REFRESH = "refresh",
  RESET_PASSWORD = "reset_password",
  // VERIFY_EMAIL = 'verify_email',
}

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  type: TokenTypes;
  expires: Date;
  blacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
