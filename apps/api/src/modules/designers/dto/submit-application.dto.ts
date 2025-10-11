import { IsUUID } from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';

export class SubmitApplicationDto extends CreateApplicationDto {
  @IsUUID()
  userId: string;
}
