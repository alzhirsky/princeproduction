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

  @IsNumber()
  @Min(0)
  baseDesignerPrice: number;

  @IsNumber()
  @Min(0)
  platformMarkup: number;

  @IsBoolean()
  @IsOptional()
  reviewsEnabled?: boolean = true;

  @IsArray()
  @IsOptional()
  examples?: string[] = [];

  @IsUUID()
  @IsOptional()
  assignedDesignerId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
