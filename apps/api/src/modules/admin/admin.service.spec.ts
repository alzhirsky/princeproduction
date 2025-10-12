import { describe, expect, it, vi } from 'vitest';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  it('returns overview metrics', async () => {
    const prismaMock = {
      order: { count: vi.fn().mockResolvedValue(2) },
      designerApplication: { count: vi.fn().mockResolvedValue(1) },
      payoutRequest: { count: vi.fn().mockResolvedValue(1) },
      payment: { aggregate: vi.fn().mockResolvedValue({ _sum: { amountGross: 5000 } }) }
    } as any;

    const service = new AdminService(prismaMock);
    const overview = await service.getOverview();
    expect(overview.ordersInProgress).toBe(2);
    expect(overview.totalRevenue).toBe(5000);
    expect(overview.designerApplicationsPending).toBe(1);
    expect(overview.lastUpdatedAt).toBeTruthy();
  });
});
