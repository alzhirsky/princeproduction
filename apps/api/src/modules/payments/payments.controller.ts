import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateHoldDto } from './dto/create-hold.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('create-hold')
  createHold(@Body() payload: CreateHoldDto) {
    return this.payments.createHold(payload.orderId, payload.amount);
  }

  @Post(':id/capture')
  capture(@Param('id') id: string) {
    return this.payments.capture(id);
  }

  @Post(':id/refund')
  refund(@Param('id') id: string) {
    return this.payments.refund(id);
  }
}
