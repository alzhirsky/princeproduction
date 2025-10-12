import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  descriptionMd: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  @IsOptional()
  turnaround?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baseDesignerPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  platformMarkup: number;

  @IsBoolean()
  @IsOptional()
  reviewsEnabled?: boolean = true;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  examples?: string[] = [];

  @IsUUID()
  @IsOptional()
  assignedDesignerId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
