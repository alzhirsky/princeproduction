import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

const MESSAGE_ROLES = ['buyer', 'designer', 'admin'] as const;

export class CreateMessageDto {
  @IsIn(MESSAGE_ROLES)
  senderRole: (typeof MESSAGE_ROLES)[number];

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];
}
