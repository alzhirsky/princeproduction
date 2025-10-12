import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatMessageInput, chatMessageSchema } from '@prince/shared';
import { PrismaService } from '../../infra/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message:new')
  async handleMessage(@MessageBody() payload: ChatMessageInput) {
    const parsed = chatMessageSchema.safeParse(payload);
    if (!parsed.success) {
      this.logger.warn('Invalid payload received', parsed.error);
      return;
    }

    const { orderId, senderRole, body, attachments } = parsed.data;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { chat: true }
    });

    if (!order) {
      this.logger.warn(`Order ${orderId} not found for chat message`);
      return;
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
        senderRole,
        body,
        attachments
      }
    });

    const eventPayload = {
      id: message.id,
      orderId,
      senderRole: message.senderRole,
      body: message.body,
      attachments: message.attachments,
      createdAt: message.createdAt
    };

    this.server.emit(`order:${orderId}:message`, eventPayload);
    return eventPayload;
  }
}
