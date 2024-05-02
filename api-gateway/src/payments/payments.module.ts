import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentHttpController } from './payments.controller';

@Module({
  imports: [
    // REST axios
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        baseURL: config.getOrThrow<string>('PAYMENTS_MICROSERVICE_URL'),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [PaymentHttpController],
  providers: [],
})
export class PaymentModule {}
