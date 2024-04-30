import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ValidateErrors } from 'src/common/decorators/validate-error.decorator';
import { ChangeStatusOrderService } from 'src/orders/application/change-status-order.service';
import { CreateOrderService } from 'src/orders/application/create-order.service';
import { FindAllOrdersService } from 'src/orders/application/find-all-orders.service';
import { FindByIdOrderService } from 'src/orders/application/find-by-id-order.service';
import { ChangeOrderStatusDto } from '../dto/request/change-order-status.request.dto';
import { CreateOrderDto } from '../dto/request/create-order.request.dto';

@Controller()
@ValidateErrors()
export class OrdersTcpController {
  constructor(
    private readonly findAllOrdersService: FindAllOrdersService,
    private readonly createOrderService: CreateOrderService,
    private readonly findByIdOrderService: FindByIdOrderService,
    private readonly changeStatusOrderService: ChangeStatusOrderService,
  ) {}

  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.createOrderService.create(createOrderDto);
  }

  @MessagePattern({ cmd: 'find_all_orders' })
  async findAll() {
    const logger = new Logger('API Gateway');
    logger.log(`OrdersController.findAll()`);
    return { data: await this.findAllOrdersService.findAll() };
  }

  @MessagePattern({ cmd: 'find_one_order' })
  findOne(@Payload() id: number) {
    return this.findByIdOrderService.findOne(id);
  }

  @MessagePattern({ cmd: 'change_status' })
  changeStatus(@Payload() { status, id }: ChangeOrderStatusDto) {
    return this.changeStatusOrderService.changeStatus(id, status);
  }
}
