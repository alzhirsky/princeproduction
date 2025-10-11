import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateHoldDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
