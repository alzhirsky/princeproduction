import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ORDER_STATUSES, OrderStatus, ROLES, Role } from '@prince/shared';

export class ListOrdersDto {
  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

  @IsOptional()
  @IsIn(ROLES)
  role?: Role;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
