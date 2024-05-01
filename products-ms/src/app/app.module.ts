import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NATS_SERVICE, natsOptions } from './constants';

@Module({
  imports: [
    // Environment
    ConfigModule.forRoot({
      envFilePath: `./${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
    // Database Type ORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.getOrThrow<string>('DB_TYPE'),
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_DATABASE'),
          entities: [__dirname + '../../**/*.dao{.ts,.js}'],
          // autoLoadEntities: true,
          synchronize: true,
        }) as TypeOrmModuleAsyncOptions,
    }),
    // NATS Client
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.getOrThrow<string>('NATS_SERVERS')],
            ...natsOptions,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
