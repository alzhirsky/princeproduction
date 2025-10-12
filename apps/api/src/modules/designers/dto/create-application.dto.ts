import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  portfolioLinks: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  portfolioFiles?: string[];

  @IsString()
  @IsOptional()
  rateNotes?: string;
}
