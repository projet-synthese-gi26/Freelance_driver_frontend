export type ReactionType =
  | "LIKE"
  | "DISLIKE"
  | "LOVE"
  | "ANGRY"
  | "SAD"
  | "LAUGH"
  | "CELEBRATE";

export type ReactionTargetType =
  | "PRODUCT"
  | "DRIVER"
  | "CLIENT"
  | "ORGANISATION"
  | "VEHICLE"
  | "PLATFORM"
  | "REVIEW";

export interface Reaction {
  id: string;
  actorId: string;
  targetId: string;
  targetType: ReactionTargetType;
  type: ReactionType;
  createdAt?: string | null;
}

export interface ReactionPayload {
  targetId: string;
  targetType: ReactionTargetType;
  type: ReactionType;
}
