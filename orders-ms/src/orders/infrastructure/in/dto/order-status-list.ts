import { OrderStatus } from '../../../domain/value-objects/order-status.vo';

export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.CANCELED,
  OrderStatus.DELIVERED,
];
