import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentHttpController {
  constructor(private readonly httpService: HttpService) {}

  @Post('create-payment')
  create() {
    return this.httpService.axiosRef
      .post(`/create-payment`)
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
