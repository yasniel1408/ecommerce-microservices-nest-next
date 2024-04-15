import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_MICROSERVICE } from './constants.services';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    // Configuring the client Gateway y sus microservices
    ClientsModule.registerAsync([
      {
        name: PRODUCT_MICROSERVICE,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>(
              'PRODUCTS_MICROSERVICE_HOST',
            ),
            port: configService.getOrThrow<number>(
              'PRODUCTS_MICROSERVICE_PORT',
            ),
          },
        }),
      },
    ]),
  ],
})
export class ProductsModule {}
