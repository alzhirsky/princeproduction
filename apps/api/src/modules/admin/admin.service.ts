import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getOverview() {
    return {
      ordersInProgress: 12,
      designerApplicationsPending: 4,
      payoutRequests: 3,
      totalRevenue: 256000,
      lastUpdatedAt: new Date().toISOString()
    };
  }
}
