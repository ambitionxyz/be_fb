export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findOne(field: Object): Promise<T>;
  update(id: number, updateField: Object): Promise<T>;
  create(model: T): Promise<T>;
  delete(id: number): Promise<void>;
  checkDuplicate(query, id): Promise<T>;
}
