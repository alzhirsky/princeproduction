import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { mockCategories, mockServices } from '../../common/mock-data';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories() {
    return mockCategories;
  }

  async listServices() {
    return mockServices.map((service) => ({
      ...service,
      totalPrice: service.price + service.platformMarkup
    }));
  }

  async createService(payload: CreateServiceDto) {
    return {
      id: `svc-${Date.now()}`,
      ...payload,
      totalPrice: payload.baseDesignerPrice + payload.platformMarkup
    };
  }

  async updateService(id: string, payload: UpdateServiceDto) {
    return {
      id,
      ...payload
    };
  }
}
