export interface ProductControllerPort<C, U, P> {
  create(createProductDto: C): any;
  findAll(pagination: P): any;
  findOne(id: number): any;
  update(id: number, updateProductDto: U): any;
  remove(id: number): any;
}
