export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findOne(field: Object): Promise<T>;
  update(id: string, updateField: Object): Promise<T>;
  create(model: T): Promise<T>;
  delete(id: string): Promise<void>;
  checkDuplicate(query, id): Promise<T>;
}
