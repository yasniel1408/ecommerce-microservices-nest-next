export interface ProductTCPControllerPort<C, U, P> {
  create(createProductDto: C): any;
  findAll(pagination: P): any;
  findOne(id: number): any;
  update(updateProductDto: U): any;
  remove(id: number): any;
}
