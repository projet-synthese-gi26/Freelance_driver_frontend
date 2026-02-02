export type PlanningStatus =
  | 'Draft'
  | 'Published'
  | 'PendingConfirmation'
  | 'PendingDriverConfirmation'
  | 'Confirmed'
  | 'Ongoing'
  | 'Terminated'
  | 'Expired'
  | 'Cancelled';

export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type TripIntention = 'PASSENGERS' | 'PACKAGES' | 'BOTH';
export type PricingMethod = 'FIXED' | 'PER_KM' | 'PER_HOUR' | 'PER_DAY';
export type PaymentOption = 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'TRANSFER';

export interface Planning {
  id: string;
  orgId?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  clientPhoneNumber?: string | null;
  profileImageUrl?: string | null;
  title: string;
  departureLocation: string;
  dropoffLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reservedById?: string | null;
  paymentMethod?: string | null;
  status: PlanningStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
  tripType: TripType;
  meetupPoint: string;
  tripIntention: TripIntention;
  pricingMethod: PricingMethod;
  metadata?: unknown[];
  paymentOption: PaymentOption;
  regularAmount: string;
  discountPercentage: string;
  discountedAmount: string;
  negotiable: boolean;
  reviewableType?: string;
  reactableType?: string;
  reviewableId?: string;
  reactableId?: string;
  averageRating?: number;
  reactionCounts?: Record<string, number>;
  assetId?: string;
  ownerId?: string;
}

export type PlanningPayload = Omit<
  Planning,
  | 'id'
  | 'orgId'
  | 'clientId'
  | 'clientName'
  | 'clientPhoneNumber'
  | 'profileImageUrl'
  | 'reservedById'
  | 'paymentMethod'
  | 'createdAt'
  | 'updatedAt'
  | 'metadata'
  | 'reviewableType'
  | 'reactableType'
  | 'reviewableId'
  | 'reactableId'
  | 'averageRating'
  | 'reactionCounts'
  | 'assetId'
  | 'ownerId'
>;

export interface PlanningRequestPayload extends PlanningPayload {
  isNegotiable?: boolean;
}