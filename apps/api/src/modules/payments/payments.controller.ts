import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('create-hold')
  createHold(@Body() payload: { orderId: string; amount: number }) {
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
