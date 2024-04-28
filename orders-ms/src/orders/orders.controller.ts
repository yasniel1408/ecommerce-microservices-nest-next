import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller()
@ValidateErrors()
export class OrdersTcpController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  async findAll() {
    const logger = new Logger('API Gateway');
    logger.log(`OrdersController.findAll()`);
    return { data: await this.ordersService.findAll() };
  }

  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_status' })
  changeStatus(@Payload() { status, id }: ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(id, status);
  }
}
