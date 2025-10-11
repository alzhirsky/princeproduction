import { describe, expect, it } from 'vitest';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  it('returns overview metrics', () => {
    const service = new AdminService();
    const overview = service.getOverview();
    expect(overview.ordersInProgress).toBeGreaterThanOrEqual(0);
    expect(overview.lastUpdatedAt).toBeTruthy();
  });
});
