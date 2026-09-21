export type PermissionStatus =
  | "unchecked"
  | "permission_required"
  | "pending"
  | "verified";

export type BookingStatus = "pending" | "accepted" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  verified: boolean;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  area: string;
  price: number;
  startDate: string;
  endDate: string;
  description: string;
  furnished: boolean;
  image: string;
  permissionStatus: PermissionStatus;
  published: boolean;
}

export interface BookingRequest {
  id: string;
  listingId: string;
  renterId: string;
  status: BookingStatus;
}
