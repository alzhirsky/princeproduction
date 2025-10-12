import 'server-only';
import { OrderChatMessage, OrderDetail, ServiceSummary } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? 'http://localhost:4000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    next: init?.method && init.method !== 'GET' ? undefined : { revalidate: 30 }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchServices(): Promise<ServiceSummary[]> {
  return apiFetch<ServiceSummary[]>('/services');
}

export async function fetchService(id: string): Promise<ServiceSummary> {
  return apiFetch<ServiceSummary>(`/services/${id}`);
}

export async function fetchOrder(id: string): Promise<OrderDetail> {
  return apiFetch<OrderDetail>(`/orders/${id}`);
}

export async function postOrderMessage(orderId: string, payload: { senderRole: 'buyer' | 'designer' | 'admin'; body: string }): Promise<OrderChatMessage> {
  return apiFetch<OrderChatMessage>(`/orders/${orderId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ ...payload, attachments: [] })
  });
}
