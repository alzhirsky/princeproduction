export const ROLES = ['guest', 'buyer', 'designer', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = [
  'new',
  'in_work',
  'on_review',
  'revision',
  'awaiting_admin_confirm',
  'completed',
  'cancelled',
  'disputed'
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DESIGNER_APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type DesignerApplicationStatus = (typeof DESIGNER_APPLICATION_STATUSES)[number];

export const PAYMENT_STATUSES = ['hold', 'captured', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYOUT_STATUSES = ['requested', 'approved', 'paid', 'rejected'] as const;
export type PayoutStatus = (typeof PAYOUT_STATUSES)[number];

export const REVIEW_VISIBILITY = ['visible', 'hidden'] as const;
export type ReviewVisibility = (typeof REVIEW_VISIBILITY)[number];
