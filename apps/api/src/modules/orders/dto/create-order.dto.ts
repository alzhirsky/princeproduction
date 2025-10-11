import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

class BriefDto {
  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @IsUUID()
  serviceId: string;

  @ValidateNested()
  @Type(() => BriefDto)
  brief: BriefDto;

  @IsArray()
  @IsOptional()
  attachments?: string[] = [];
}
