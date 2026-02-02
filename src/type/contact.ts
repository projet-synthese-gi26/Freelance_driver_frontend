export type ContactableType = 'ORGANISATION' | 'ORGANIZATION';

export interface Contact {
  id: string;
  contactableId?: string | null;
  contactableType?: ContactableType | null;
  firstName?: string | null;
  lastName?: string | null;
  title?: string | null;
  isEmailVerified?: boolean | null;
  isPhoneNumberVerified?: boolean | null;
  isFavorite?: boolean | null;
  phoneNumber?: string | null;
  secondaryPhoneNumber?: string | null;
  faxNumber?: string | null;
  email?: string | null;
  secondaryEmail?: string | null;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface ContactPayload {
  contactableType: ContactableType;
  firstName: string;
  lastName: string;
  title?: string | null;
  isEmailVerified?: boolean | null;
  isPhoneNumberVerified?: boolean | null;
  isFavorite?: boolean | null;
  phoneNumber?: string | null;
  secondaryPhoneNumber?: string | null;
  faxNumber?: string | null;
  email?: string | null;
  secondaryEmail?: string | null;
}
