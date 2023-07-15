import TokenRepository from "../repositories/TokenRepository";
import { ITokenRepository } from "../types/Repositories/ITokenRepository";

class TokenService {
  private _repository: ITokenRepository = TokenRepository;
  
}

export = new TokenService();
