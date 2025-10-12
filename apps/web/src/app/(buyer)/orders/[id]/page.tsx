import { OrderChatClient } from '@/components/order-chat-client';
import { fetchOrder } from '@/lib/api';
import { notFound } from 'next/navigation';

interface OrderChatPageProps {
  params: { id: string };
}

export default async function OrderChatPage({ params }: OrderChatPageProps) {
  let order;
  try {
    order = await fetchOrder(params.id);
  } catch (error) {
    console.error('Failed to load order', error);
    notFound();
  }

  if (!order) {
    notFound();
  }

  const serviceTitle = order.service?.title ?? 'Услуга';
  const statusLabel = order.status.replace(/_/g, ' ');
  const messages = order.chat?.messages ?? [];

  return (
    <div className="space-y-6">
      <header className="glass p-6">
        <h1 className="text-2xl font-semibold">Заказ · {serviceTitle}</h1>
        <p className="text-sm text-white/60">Статус: {statusLabel} · чат обезличен (Покупатель ↔ Дизайнер)</p>
      </header>
      <OrderChatClient orderId={order.id} initialMessages={messages} />
    </div>
  );
}
