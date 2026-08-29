export type Role = 'Student' | 'ClubAdmin' | 'Admin';

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export type ClubStatus = 'Pending' | 'Approved' | 'Rejected';

export type MembershipStatus = 'Pending' | 'Approved' | 'Rejected';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  studentId?: string;
  isVerified: boolean;
  verificationStatus?: VerificationStatus;
  idCardImageUrl?: string;
  createdAt?: string;
}

export interface StudentVerification {
  id: string;
  userId: string;
  studentName?: string;
  email?: string;
  studentId: string;
  documentPath: string;
  status: VerificationStatus;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerId: string;
  ownerName?: string;
  logoUrl?: string;
  status: ClubStatus;
  isActive: boolean;
  rejectionReason?: string;
  createdAt: string;
  approvedAt?: string;
  memberCount?: number;
  isJoined?: boolean;
  membershipStatus?: MembershipStatus;
}

export interface Membership {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userStudentId?: string;
  clubId: string;
  clubName?: string;
  clubLogoUrl?: string;
  status: MembershipStatus;
  appliedAt: string;
  approvedAt?: string;
  leftAt?: string;
  rejectionReason?: string;
}

export interface Event {
  id: string;
  clubId: string;
  clubName?: string;
  clubLogoUrl?: string;
  title: string;
  description: string;
  bannerUrl?: string;
  date: string;
  venue: string;
  price: number;
  capacity: number;
  registeredCount: number;
  seatsRemaining: number;
  registrationDeadline: string;
  createdAt: string;
  isRegistered?: boolean;
  registrationId?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  paymentStatus: PaymentStatus;
  registeredAt: string;
  qrCode?: string;
}

export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  eventTitle?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  sessionId?: string;
  paymentMethod?: string;
  createdAt: string;
  paidAt?: string;
  receiptUrl?: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  clubName?: string;
  authorId: string;
  authorName?: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  clubId?: string;
  clubName?: string;
  title: string;
  message: string;
  type: 'Announcement' | 'System' | 'Verification' | 'Membership' | 'Event';
  isRead: boolean;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalStudents: number;
  pendingStudentVerifications: number;
  totalClubs: number;
  pendingClubApplications: number;
  totalEvents: number;
  totalActiveMemberships: number;
  revenueTotal?: number;
}

export interface ClubAdminDashboardStats {
  managedClubsCount: number;
  totalClubMembers: number;
  pendingMembershipApplications: number;
  upcomingEventsCount: number;
  totalAnnouncementsCount: number;
  managedClubs?: Club[];
}

export interface StudentDashboardStats {
  joinedClubsCount: number;
  upcomingRegisteredEventsCount: number;
  pendingClubApplicationsCount: number;
  isStudentVerified: boolean;
  verificationStatus: VerificationStatus;
  joinedClubs?: Club[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}
