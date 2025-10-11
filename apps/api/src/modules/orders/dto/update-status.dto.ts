import { IsIn } from 'class-validator';
import { ORDER_STATUSES, OrderStatus } from '@prince/shared';

export class UpdateStatusDto {
  @IsIn(ORDER_STATUSES)
  status: OrderStatus;
}
