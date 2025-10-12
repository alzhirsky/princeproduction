import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Service } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesDto } from './dto/list-services.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }]
    });
  }

  async listServices(filters: ListServicesDto = {}) {
    const where: Prisma.ServiceWhereInput = {
      isActive: true
    };

    if (filters.category) {
      where.categoryId = filters.category;
    }

    if (filters.platform) {
      where.platform = filters.platform;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { descriptionMd: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const priceFilters: Prisma.ServiceWhereInput[] = [];
    if (filters.priceFrom !== undefined) {
      priceFilters.push({ baseDesignerPrice: { gte: filters.priceFrom } });
    }
    if (filters.priceTo !== undefined) {
      priceFilters.push({ baseDesignerPrice: { lte: filters.priceTo } });
    }

    if (priceFilters.length > 0) {
      where.AND = [...(where.AND ?? []), ...priceFilters];
    }

    const orderBy: Prisma.ServiceOrderByWithRelationInput[] = [];
    if (filters.sort === 'price_asc') {
      orderBy.push({ baseDesignerPrice: 'asc' });
    } else if (filters.sort === 'price_desc') {
      orderBy.push({ baseDesignerPrice: 'desc' });
    } else {
      orderBy.push({ createdAt: 'desc' });
    }

    const services = await this.prisma.service.findMany({
      where,
      orderBy,
      include: {
        assignedDesigner: { select: { displayAlias: true } },
        category: { select: { name: true } }
      }
    });

    return services
      .filter((service) => {
        const total = service.baseDesignerPrice + service.platformMarkup;
        if (filters.priceFrom !== undefined && total < filters.priceFrom) {
          return false;
        }
        if (filters.priceTo !== undefined && total > filters.priceTo) {
          return false;
        }
        return true;
      })
      .map((service) => this.toServiceSummary(service));
  }

  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        assignedDesigner: { select: { displayAlias: true } },
        category: { select: { name: true } }
      }
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.toServiceSummary(service);
  }

  async createService(payload: CreateServiceDto) {
    const created = await this.prisma.service.create({
      data: {
        categoryId: payload.categoryId,
        title: payload.title,
        descriptionMd: payload.descriptionMd,
        coverUrl: payload.coverUrl,
        format: payload.format,
        platform: payload.platform,
        turnaround: payload.turnaround,
        baseDesignerPrice: payload.baseDesignerPrice,
        platformMarkup: payload.platformMarkup,
        reviewsEnabled: payload.reviewsEnabled ?? true,
        examples: payload.examples ?? [],
        assignedDesignerId: payload.assignedDesignerId,
        isActive: payload.isActive ?? true
      }
    });

    return this.getServiceById(created.id);
  }

  async updateService(id: string, payload: UpdateServiceDto) {
    await this.prisma.service.update({
      where: { id },
      data: {
        ...payload,
        descriptionMd: payload.descriptionMd,
        assignedDesignerId: payload.assignedDesignerId
      }
    });

    return this.getServiceById(id);
  }

  private toServiceSummary(service: Service & { assignedDesigner?: { displayAlias: string | null }; category?: { name: string } }) {
    return {
      id: service.id,
      categoryId: service.categoryId,
      categoryName: service.category?.name ?? null,
      title: service.title,
      description: service.descriptionMd,
      coverUrl: service.coverUrl ?? null,
      format: service.format,
      platform: service.platform,
      turnaround: service.turnaround,
      totalPrice: service.baseDesignerPrice + service.platformMarkup,
      reviewsEnabled: service.reviewsEnabled,
      examples: Array.isArray(service.examples) ? service.examples : [],
      designerAlias: service.assignedDesigner?.displayAlias ?? 'Дизайнер платформы'
    };
  }
}
