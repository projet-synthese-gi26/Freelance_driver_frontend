export type AnnouncementStatus =
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

export interface Announcement {
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
  status: AnnouncementStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
  tripType: TripType;
  meetupPoint: string;
  tripIntention: TripIntention;
  pricingMethod: PricingMethod;
  metadata?: unknown[];
  cost: string;
  baggageInfo: string;
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

export type AnnouncementPayload = Omit<
  Announcement,
  | 'id'
  | 'orgId'
  | 'clientId'
  | 'clientName'
  | 'clientPhoneNumber'
  | 'profileImageUrl'
  
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

export interface AnnouncementRequestPayload extends Omit<AnnouncementPayload, 'negotiable'> {
  negotiable?: boolean;
  isNegotiable?: boolean;
}