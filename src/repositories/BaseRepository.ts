import { Model } from "mongoose";
import { IBaseRepository } from "../types/Repositories/IBaseRepository";
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  public readonly _db;
  public readonly _repoName;

  constructor(db: Model<T>, repoName: string) {
    this._db = db;
    this._repoName = repoName;
  }

  async findAll(): Promise<T[]> {
    return await this._db.find({});
  }

  async findOne(field: object): Promise<T> {
    return await this._db.findOne(field);
  }

  async checkDuplicate(query, id): Promise<T> {
    const result = await this._db.findOne({ ...query, id: { $ne: id } });
    return result;
  }

  async update(id: string, updateFeild: Object): Promise<T> {
    return await this._db.findOneAndUpdate({ id }, updateFeild);
  }

  async create(model: T): Promise<T> {
    return await this._db.create(model);
  }

  async delete(id: string): Promise<void> {
    await this._db.deleteOne({ id });
  }
}
