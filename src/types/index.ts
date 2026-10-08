export type UserRole = 'creator' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string; // Demo only — never store plaintext passwords in production
  role: UserRole;
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  tiktokUsername: string;
  tiktokProfileUrl: string;
  country: string;
  instagramUsername?: string;
  bio?: string;
  followerCount?: string;
  updatedAt: string;
}

export type CampaignStatus = 'open' | 'closed';

export interface Campaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  productImage: string;
  productDetails: string;
  requirements: string[];
  rewards: string[];
  rewardSummary: string;
  deadline: string;
  status: CampaignStatus;
  createdAt: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  campaignId: string;
  userId: string;
  creatorName: string;
  creatorEmail: string;
  tiktokUsername: string;
  tiktokProfileUrl: string;
  country: string;
  instagramUsername?: string;
  message: string;
  status: ApplicationStatus;
  appliedAt: string;
  reviewedAt?: string;
}

export type SubmissionStatus = 'not_submitted' | 'pending_review' | 'approved' | 'rejected' | 'revision_requested';

export interface Submission {
  id: string;
  applicationId: string;
  campaignId: string;
  userId: string;
  creatorName: string;
  videoUrl: string;
  caption: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export type ShippingStatus = 'pending' | 'shipped' | 'delivered' | 'returned';

export interface ShippingRecord {
  id: string;
  applicationId: string;
  campaignId: string;
  userId: string;
  creatorName: string;
  trackingNumber?: string;
  carrier?: string;
  status: ShippingStatus;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  updatedAt: string;
}

export type PoolTier = 'standard' | 'gold' | 'vip';

export interface CreatorPoolEntry {
  id: string;
  userId: string;
  tier: PoolTier;
  totalCampaigns: number;
  approvedCampaigns: number;
  notes?: string;
  addedAt: string;
}

/** Combined view used by admin tables to show all info in one row */
export interface AdminApplicantRow {
  application: Application;
  campaign: Campaign | undefined;
  submission: Submission | undefined;
  shipping: ShippingRecord | undefined;
  poolEntry: CreatorPoolEntry | undefined;
  profile: CreatorProfile | undefined;
}
