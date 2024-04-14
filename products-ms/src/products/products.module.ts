import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './application/products.service';
import { ProductSQLAdapter } from './infrastructure/out/sql-orm/product.repository';
import { ProductDao } from './infrastructure/out/sql-orm/entities/product.dao';
import { ProductAggregate } from './domain/product.aggregate';
import { ProductsHttpController } from './infrastructure/in/http/products-http.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDao])],
  controllers: [ProductsHttpController],
  providers: [ProductsService, ProductSQLAdapter, ProductAggregate],
})
export class ProductsModule {}
