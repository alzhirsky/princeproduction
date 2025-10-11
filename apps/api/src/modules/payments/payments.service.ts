import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async createHold(orderId: string, amount: number) {
    return {
      paymentId: `pay-${Date.now()}`,
      status: 'hold',
      orderId,
      amount
    };
  }

  async capture(paymentId: string) {
    return { paymentId, status: 'captured' };
  }

  async refund(paymentId: string) {
    return { paymentId, status: 'refunded' };
  }
}
