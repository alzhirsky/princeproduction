import { Type } from 'class-transformer';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateHoldDto {
  @IsUUID()
  orderId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;
}
