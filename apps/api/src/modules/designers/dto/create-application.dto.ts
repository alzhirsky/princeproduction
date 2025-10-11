import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsArray()
  skills: string[];

  @IsArray()
  portfolioLinks: string[];

  @IsArray()
  @IsOptional()
  portfolioFiles?: string[];

  @IsString()
  @IsOptional()
  rateNotes?: string;
}
