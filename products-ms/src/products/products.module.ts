import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NATS_SERVICE } from 'src/app/constants';
import { CreateProductsService } from './application/create-products.service';
import { DeleteProductService } from './application/delete-product.service';
import { FindAllProductsService } from './application/find-all-products.service';
import { FindByIdProductService } from './application/find-by-id-product.service';
import { UpdateProductService } from './application/update-product.service';
import { ProductAggregate } from './domain/product.aggregate';
import { ProductsHttpController } from './infrastructure/in/http/products-http.controller';
import { ProductsTCPController } from './infrastructure/in/tcp/products-tcp.controller';
import { CreatedProductPublisher } from './infrastructure/out/publisher/created-product.publisher';
import { ProductDao } from './infrastructure/out/sql-orm/dao/product.dao';
import { ProductSQLAdapter } from './infrastructure/out/sql-orm/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDao]),
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow<string>('NATS_SERVERS')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductsHttpController, ProductsTCPController],
  providers: [
    CreateProductsService,
    DeleteProductService,
    FindAllProductsService,
    FindByIdProductService,
    UpdateProductService,
    ProductSQLAdapter,
    ProductAggregate,
    CreatedProductPublisher,
  ],
})
export class ProductsModule {}
