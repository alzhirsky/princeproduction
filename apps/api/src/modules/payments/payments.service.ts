import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createHold(orderId: string, amount: number, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;
    const order = await client.order.findUnique({
      where: { id: orderId },
      include: { service: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const platformFee = order.service.platformMarkup;
    const payment = await client.payment.upsert({
      where: { orderId },
      update: {
        amountGross: amount,
        amountNet: amount - platformFee,
        platformFee,
        status: 'hold'
      },
      create: {
        orderId,
        amountGross: amount,
        amountNet: amount - platformFee,
        platformFee,
        status: 'hold',
        provider: 'mock',
        payload: {}
      }
    });

    await client.order.update({ where: { id: orderId }, data: { escrowPaymentId: payment.id } });

    return payment;
  }

  async capture(paymentId: string) {
    const existing = await this.prisma.payment.findUnique({ where: { id: paymentId } });

    if (!existing) {
      throw new NotFoundException('Payment not found');
    }

    if (existing.status === 'captured') {
      return existing;
    }

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'captured' },
      include: { order: true }
    });

    if (payment.order?.designerId) {
      await this.prisma.designerBalance.upsert({
        where: { designerId: payment.order.designerId },
        update: {
          pending: { increment: payment.amountNet }
        },
        create: {
          designerId: payment.order.designerId,
          pending: payment.amountNet
        }
      });
    }

    return payment;
  }

  async refund(paymentId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'refunded' }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
