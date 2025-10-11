export type Role = 'guest' | 'buyer' | 'designer' | 'admin';

export type OrderStatus =
  | 'new'
  | 'in_work'
  | 'on_review'
  | 'revision'
  | 'awaiting_admin_confirm'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type DesignerApplicationStatus = 'pending' | 'approved' | 'rejected';

export type PaymentStatus = 'hold' | 'captured' | 'refunded';

export type PayoutStatus = 'requested' | 'approved' | 'paid' | 'rejected';

export type ReviewVisibility = 'visible' | 'hidden';
