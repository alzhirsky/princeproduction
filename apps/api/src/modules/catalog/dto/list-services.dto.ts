import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class ListServicesDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  priceFrom?: number;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  priceTo?: number;

  @IsEnum(['newest', 'price_asc', 'price_desc'], {
    message: 'sort must be one of newest|price_asc|price_desc'
  })
  @IsOptional()
  sort?: 'newest' | 'price_asc' | 'price_desc';
}
