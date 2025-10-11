export interface ServiceSummary {
  id: string;
  categoryId: string;
  categoryName: string | null;
  title: string;
  description: string;
  coverUrl?: string | null;
  format?: string | null;
  platform?: string | null;
  turnaround?: string | null;
  totalPrice: number;
  designerAlias: string;
}

export interface OrderChatMessage {
  id: string;
  senderRole: 'buyer' | 'designer' | 'admin';
  body: string;
  createdAt: string;
  attachments: string[];
}

export interface OrderDetail {
  id: string;
  status: string;
  serviceId: string;
  totalPrice: number;
  brief: Record<string, unknown>;
  buyer?: { id: string; displayAlias: string } | null;
  designer?: { id: string; displayAlias: string } | null;
  createdAt: string;
  updatedAt: string;
  payment?: { id: string; status: string; amountGross: number } | null;
  service?: { id: string; title: string; coverUrl?: string | null; platform?: string | null; format?: string | null } | null;
  chat?: { id: string; messages?: OrderChatMessage[] } | null;
}
