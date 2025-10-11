import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatMessageInput, chatMessageSchema } from '@prince/shared';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message:new')
  handleMessage(@MessageBody() payload: ChatMessageInput) {
    const parsed = chatMessageSchema.safeParse(payload);
    if (!parsed.success) {
      this.logger.warn('Invalid payload received', parsed.error);
      return;
    }
    this.server.emit(`order:${parsed.data.orderId}:message`, {
      ...parsed.data,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
}
