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
}
export = new TokenRepository();
