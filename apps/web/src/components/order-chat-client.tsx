'use client';

import { useState } from 'react';
import { ChatThread } from './ui/chat-thread';
import { OrderChatMessage } from '@/lib/types';

interface OrderChatClientProps {
  orderId: string;
  initialMessages: OrderChatMessage[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export function OrderChatClient({ orderId, initialMessages }: OrderChatClientProps) {
  const [messages, setMessages] = useState<OrderChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (body: string) => {
    const optimisticMessage: OrderChatMessage = {
      id: `optimistic-${Date.now()}`,
      senderRole: 'buyer',
      body,
      createdAt: new Date().toISOString(),
      attachments: []
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderRole: 'buyer', body, attachments: [] })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const savedMessage = (await response.json()) as OrderChatMessage;
      setMessages((prev) => prev.map((msg) => (msg.id === optimisticMessage.id ? savedMessage : msg)));
    } catch (error) {
      console.error(error);
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  return <ChatThread messages={messages} onSend={isSending ? () => undefined : handleSend} />;
}
