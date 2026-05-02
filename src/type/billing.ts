export type BillingPlan = {
  id: string;
  code: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  active: boolean;
};

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export type BillingSubscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};
