'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { sampleServices } from '@/lib/sample-data';
import { ChatThread } from '@/components/ui/chat-thread';

export default function OrderChatPage() {
  const { id } = useParams<{ id: string }>();
  const service = useMemo(() => sampleServices.find((item) => item.id === id) ?? sampleServices[0], [id]);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      role: 'designer' as const,
      content: 'Привет! Готов начать работу, уточните про брендбук?',
      timestamp: '10:21'
    },
    {
      id: 'm2',
      role: 'buyer' as const,
      content: 'Привет! Брендбук приложил, основная палитра — графит/лазурь.',
      timestamp: '10:24'
    }
  ]);

  return (
    <div className="space-y-6">
      <header className="glass p-6">
        <h1 className="text-2xl font-semibold">Заказ · {service.title}</h1>
        <p className="text-sm text-white/60">Статус: в работе · чат обезличен (Покупатель ↔ Дизайнер)</p>
      </header>
      <ChatThread
        messages={messages}
        onSend={(message) =>
          setMessages((prev) => [
            ...prev,
            { id: String(Date.now()), role: 'buyer', content: message, timestamp: new Date().toLocaleTimeString('ru-RU') }
          ])
        }
      />
    </div>
  );
}
