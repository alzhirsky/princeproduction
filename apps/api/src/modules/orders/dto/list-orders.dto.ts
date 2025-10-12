import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ORDER_STATUSES, OrderStatus, ROLES, Role } from '@prince/shared';

const ORDER_QUERY_ROLES = ROLES.filter((role) => role !== 'guest');

export class ListOrdersDto {
  @IsOptional()
  @IsIn(ORDER_STATUSES)
  status?: OrderStatus;

  @IsOptional()
  @IsIn(ORDER_QUERY_ROLES)
  role?: Role;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
