import { describe, expect, it } from 'vitest';
import { createOrderSchema, designerApplicationSchema } from './schemas';

describe('shared schemas', () => {
  it('validates order creation payload', () => {
    const payload = {
      serviceId: 'b45a6d6a-7f13-4c64-b75d-b09ffcc7e59f',
      buyerId: 'f7fb9cb9-6d34-49ed-a2ea-0211e0745c27',
      brief: {
        goal: 'CTR boost',
        platform: 'YouTube',
        format: '1920x1080',
        deadline: '48h'
      },
      attachments: []
    };

    const result = createOrderSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('rejects empty designer application', () => {
    const result = designerApplicationSchema.safeParse({
      bio: '',
      skills: [],
      portfolioLinks: []
    });

    expect(result.success).toBe(false);
  });
});
