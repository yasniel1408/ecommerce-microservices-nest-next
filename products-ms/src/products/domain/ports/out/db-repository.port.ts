export interface ProductRepositoryPort<C, U, P> {
  save(createProductDto: C): any;
  findAll(pagination: P): any;
  findById(id: number): any;
  updateById(id: number, updateProductDto: U): any;
  removeById(id: number): any;
}
