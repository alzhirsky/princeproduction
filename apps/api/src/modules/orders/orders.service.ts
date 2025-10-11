import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const mockOrders = [
  {
    id: 'ord-1',
    serviceId: 'svc-thumbnail',
    buyerId: 'buyer-1',
    designerId: 'designer-1',
    status: 'in_work',
    totalPrice: 10800,
    createdAt: new Date().toISOString()
  }
];

@Injectable()
export class OrdersService {
  async list(role?: string) {
    return mockOrders.filter((order) => (role ? order.status === role : true));
  }

  async getById(id: string) {
    return mockOrders.find((order) => order.id === id);
  }

  async create(payload: CreateOrderDto) {
    const order = {
      id: `ord-${Date.now()}`,
      status: 'new',
      totalPrice: 0,
      ...payload
    };
    mockOrders.push(order as any);
    return order;
  }

  async updateStatus(id: string, payload: UpdateStatusDto) {
    return {
      id,
      status: payload.status
    };
  }
}
