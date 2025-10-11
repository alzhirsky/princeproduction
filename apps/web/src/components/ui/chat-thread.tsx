'use client';

import { FormEvent, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'buyer' | 'designer' | 'admin';
  content: string;
  timestamp: string;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
}

export function ChatThread({ messages, onSend }: ChatThreadProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get('message') ?? '');
    if (message.trim().length === 0) return;
    onSend(message);
    form.reset();
  };

  return (
    <div className="glass grid gap-6 p-6">
      <div className="space-y-4">
        {messages.map((message) => (
          <article key={message.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
              <span>
                {message.role === 'buyer' && 'Покупатель'}
                {message.role === 'designer' && 'Дизайнер'}
                {message.role === 'admin' && 'Админ'}
              </span>
              <span>{message.timestamp}</span>
            </div>
            <p className="max-w-3xl rounded-3xl bg-white/8 p-4 text-sm text-white/80 shadow-glass">{message.content}</p>
          </article>
        ))}
      </div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          name="message"
          placeholder="Напишите сообщение (контакты и ссылки скрываются автоматически)"
          className="min-h-[120px] rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-white/40"
        />
        <button
          type="submit"
          className="self-end rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
