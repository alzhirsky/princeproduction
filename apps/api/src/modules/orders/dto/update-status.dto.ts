import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prince/shared';

export class UpdateStatusDto {
  @IsEnum(['new', 'in_work', 'on_review', 'revision', 'awaiting_admin_confirm', 'completed', 'cancelled', 'disputed'])
  status: OrderStatus;
}
