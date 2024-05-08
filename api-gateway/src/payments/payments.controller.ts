import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentSessionDto } from './dtos/payment-session.dto';

@Controller('payments')
export class PaymentHttpController {
  constructor(private readonly httpService: HttpService) {}

  @Post('create-payment')
  create(@Body() body: PaymentSessionDto) {
    return this.httpService.axiosRef
      .post(`/create-payment`, body)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
      });
  }

  @Get('success')
  async success() {
    return this.httpService.axiosRef
      .get(`/success`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
      });
  }

  @Get('cancelled')
  cancelled() {
    return this.httpService.axiosRef
      .get(`/cancelled`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
      });
  }

  @Post('webhook')
  stripeWebhook() {
    return this.httpService.axiosRef
      .post(`/webhook`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
      });
  }
}
