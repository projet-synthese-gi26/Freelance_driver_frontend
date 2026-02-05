export type ReviewType = "RATING" | "REPORT";
export type ReviewSubjectType =
  | "PRODUCT"
  | "DRIVER"
  | "CLIENT"
  | "ORGANISATION"
  | "VEHICLE"
  | "PLATFORM"
  | "REVIEW";

export interface Review {
  id: string;
  authorId: string;
  subjectId: string;
  subjectType: ReviewSubjectType;
  reviewType?: ReviewType;
  rating?: number | null;
  comment?: string | null;
  reportReason?: string | null;
  isVerifiedPurchase?: boolean | null;
  createdAt?: string | null;
  reactableType?: string | null;
  reactableId?: string | null;
  reactionCounts?: Record<string, number> | null;
}

export interface ReviewPayload {
  subjectId: string;
  subjectType: ReviewSubjectType;
  reviewType: ReviewType;
  rating?: number | null;
  comment?: string | null;
  reportReason?: string | null;
}
