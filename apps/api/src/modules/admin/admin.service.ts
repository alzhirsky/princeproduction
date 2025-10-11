import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [ordersInProgress, designerApplicationsPending, payoutRequests, paymentAggregate] = await Promise.all([
      this.prisma.order.count({
        where: {
          status: {
            in: ['in_work', 'on_review', 'revision', 'awaiting_admin_confirm']
          }
        }
      }),
      this.prisma.designerApplication.count({ where: { status: 'pending' } }),
      this.prisma.payoutRequest.count({ where: { status: 'requested' } }),
      this.prisma.payment.aggregate({
        _sum: { amountGross: true },
        where: { status: 'captured' }
      })
    ]);

    return {
      ordersInProgress,
      designerApplicationsPending,
      payoutRequests,
      totalRevenue: paymentAggregate._sum.amountGross ?? 0,
      lastUpdatedAt: new Date().toISOString()
    };
  }
}
