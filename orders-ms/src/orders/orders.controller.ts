import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';

@Controller()
@ValidateErrors()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload() id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_status' })
  chageStatus(@Payload() status: string) {
    return this.ordersService.changeStatus(status);
  }
}
