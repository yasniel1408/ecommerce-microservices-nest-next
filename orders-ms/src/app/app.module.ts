import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    // Environment
    ConfigModule.forRoot({
      envFilePath: `./${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
    // // Database Type ORM
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) =>
    //     ({
    //       type: configService.getOrThrow<string>('DB_TYPE'),
    //       host: configService.getOrThrow<string>('DB_HOST'),
    //       port: configService.getOrThrow<number>('DB_PORT'),
    //       username: configService.getOrThrow<string>('DB_USERNAME'),
    //       password: configService.getOrThrow<string>('DB_PASSWORD'),
    //       database: configService.getOrThrow<string>('DB_DATABASE'),
    //       entities: [__dirname + '../../**/*.dao{.ts,.js}'],
    //       // autoLoadEntities: true,
    //       synchronize: true,
    //     }) as TypeOrmModuleAsyncOptions,
    // }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
