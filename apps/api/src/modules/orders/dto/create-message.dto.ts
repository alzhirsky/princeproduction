import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsEnum(['buyer', 'designer', 'admin'])
  senderRole: 'buyer' | 'designer' | 'admin';

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}
