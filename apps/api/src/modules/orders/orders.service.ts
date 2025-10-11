import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PaymentsService } from '../payments/payments.service';
import { ListOrdersDto } from './dto/list-orders.dto';
import { ORDER_STATUSES } from '@prince/shared';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly payments: PaymentsService) {}

  async list(filters: ListOrdersDto) {
    const where: any = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.role === 'buyer' && filters.userId) {
      where.buyerId = filters.userId;
    }
    if (filters.role === 'designer' && filters.userId) {
      where.designerId = filters.userId;
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        service: true,
        buyer: { select: { id: true, displayAlias: true } },
        designer: { select: { id: true, displayAlias: true } },
        payment: true
      }
    });

    return orders.map((order) => this.toOrderResponse(order));
  }

  async getById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        service: true,
        buyer: { select: { id: true, displayAlias: true } },
        designer: { select: { id: true, displayAlias: true } },
        payment: true,
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async create(payload: CreateOrderDto) {
    const service = await this.prisma.service.findUnique({ where: { id: payload.serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const totalPrice = service.baseDesignerPrice + service.platformMarkup;
    const designerId = payload.designerId ?? service.assignedDesignerId ?? null;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          serviceId: payload.serviceId,
          buyerId: payload.buyerId,
          designerId,
          status: 'new',
          brief: payload.brief,
          totalPrice,
          chat: {
            create: {}
          }
        },
        include: {
          service: true,
          buyer: { select: { id: true, displayAlias: true } },
          designer: { select: { id: true, displayAlias: true } },
          chat: true
        }
      });

      await this.payments.createHold(createdOrder.id, totalPrice, tx);

      return createdOrder;
    });

    return this.getById(order.id);
  }

  async updateStatus(id: string, payload: UpdateStatusDto) {
    if (!ORDER_STATUSES.includes(payload.status)) {
      throw new BadRequestException('Unknown status');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: payload.status },
      include: { payment: true }
    });

    if (payload.status === 'awaiting_admin_confirm' && updated.escrowPaymentId) {
      await this.payments.capture(updated.escrowPaymentId);
    }

    if (payload.status === 'cancelled' && updated.escrowPaymentId) {
      await this.payments.refund(updated.escrowPaymentId);
    }

    return updated;
  }

  async addMessage(orderId: string, payload: CreateMessageDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { chat: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const chatId = order.chat
      ? order.chat.id
      : (
          await this.prisma.chat.create({
            data: { orderId }
          })
        ).id;

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderRole: payload.senderRole,
        body: payload.body,
        attachments: payload.attachments ?? []
      }
    });

    return {
      id: message.id,
      senderRole: message.senderRole,
      body: message.body,
      attachments: message.attachments,
      createdAt: message.createdAt
    };
  }

  private toOrderResponse(order: any) {
    return {
      id: order.id,
      status: order.status,
      serviceId: order.serviceId,
      totalPrice: order.totalPrice,
      brief: order.brief,
      buyer: order.buyer,
      designer: order.designer,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      payment: order.payment
        ? {
            id: order.payment.id,
            status: order.payment.status,
            amountGross: order.payment.amountGross
          }
        : null,
      service: order.service
        ? {
            id: order.service.id,
            title: order.service.title,
            coverUrl: order.service.coverUrl,
            platform: order.service.platform,
            format: order.service.format
          }
        : null,
      chat: order.chat
        ? {
            id: order.chat.id,
            messages: order.chat.messages?.map((message) => ({
              id: message.id,
              senderRole: message.senderRole,
              body: message.body,
              attachments: Array.isArray(message.attachments) ? message.attachments : [],
              createdAt: message.createdAt
            }))
          }
        : null
    };
  }
}
