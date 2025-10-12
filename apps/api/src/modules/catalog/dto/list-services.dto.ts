import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc'] as const;

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

  @IsIn(SORT_OPTIONS, {
    message: 'sort must be one of newest|price_asc|price_desc'
  })
  @IsOptional()
  sort?: (typeof SORT_OPTIONS)[number];
}
