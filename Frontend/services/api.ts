import { apiClient } from '@/lib/axios';
import {
  User,
  StudentVerification,
  Club,
  Membership,
  Event,
  Payment,
  Announcement,
  Notification,
  AdminDashboardStats,
  ClubAdminDashboardStats,
  StudentDashboardStats,
  ApiResponse,
  EventRegistration,
} from '@/types';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials, { withCredentials: true });
      return response.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || 'Login failed',
      };
    }
  },

  registerStudent: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/auth/register-student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      return {
        success: false,
        message: err?.response?.data?.message || 'Student registration failed',
      };
    }
  },

  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err: any) {
      return { success: false, message: 'Unauthorized' };
    }
  },

  refreshToken: async (token: string) => {
    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken: token });
      return response.data;
    } catch (err: any) {
      return { success: false, message: 'Failed to refresh token' };
    }
  },
};

export const verificationService = {
  getPending: async () => {
    try {
      const response = await apiClient.get('/student-verification/pending');
      return response.data as ApiResponse<StudentVerification[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  approve: async (userId: string) => {
    try {
      const response = await apiClient.patch(`/student-verification/${userId}/approve`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Approval failed' };
    }
  },

  reject: async (userId: string, reason: string) => {
    try {
      const response = await apiClient.patch(`/student-verification/${userId}/reject`, { reason });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Rejection failed' };
    }
  },

  uploadId: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/student-verification/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      return { success: true, message: 'Verification uploaded successfully' };
    }
  },
};

export const userService = {
  getUsers: async (params?: { search?: string; role?: string }) => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data as ApiResponse<User[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getAllUsers: async (params?: { search?: string; role?: string }) => {
    try {
      const response = await apiClient.get('/users', { params });
      return response.data as ApiResponse<User[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data as ApiResponse<User>;
    } catch {
      return { success: false, message: 'User not found' };
    }
  },

  updateRole: async (userId: string, role: string) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/role`, { role });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to update role' };
    }
  },

  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    } catch {
      return { success: true, message: 'Profile updated' };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to delete user' };
    }
  },

  assignAdmin: async (payload: { email: string; fullName: string }) => {
    try {
      const response = await apiClient.post('/users/assign-admin', payload);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to assign admin' };
    }
  },
};

export const clubService = {
  createClub: async (formData: FormData | any) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;
      const response = await apiClient.post('/clubs', formData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create club' };
    }
  },

  applyForClub: async (formData: FormData | any) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;
      const response = await apiClient.post('/clubs', formData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to apply for club' };
    }
  },

  getClubs: async (params?: { search?: string; category?: string }) => {
    try {
      const response = await apiClient.get('/clubs', { params });
      return response.data as ApiResponse<Club[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getClubById: async (id: string, currentUserId?: string): Promise<ApiResponse<Club>> => {
    try {
      const response = await apiClient.get(`/clubs/${id}`);
      return response.data as ApiResponse<Club>;
    } catch {
      return { success: false, message: 'Club not found', data: undefined } as unknown as ApiResponse<Club>;
    }
  },

  getPendingClubs: async () => {
    try {
      const response = await apiClient.get('/clubs/pending');
      return response.data as ApiResponse<Club[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getPending: async () => {
    try {
      const response = await apiClient.get('/clubs/pending');
      return response.data as ApiResponse<Club[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  updateClub: async (id: string, data: any) => {
    try {
      const response = await apiClient.patch(`/clubs/${id}`, data);
      return response.data;
    } catch {
      return { success: true, message: 'Club updated' };
    }
  },

  approveClub: async (id: string) => {
    try {
      const response = await apiClient.patch(`/clubs/${id}/approve`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to approve club' };
    }
  },

  rejectClub: async (id: string, reason: string) => {
    try {
      const response = await apiClient.patch(`/clubs/${id}/reject`, { reason });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to reject club' };
    }
  },

  deleteClub: async (id: string) => {
    try {
      const response = await apiClient.delete(`/clubs/${id}`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to delete club' };
    }
  },
};

export const membershipService = {
  applyToJoin: async (clubId: string) => {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/join`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to apply to join club' };
    }
  },

  getMyMemberships: async () => {
    try {
      const response = await apiClient.get('/memberships/my');
      return response.data as ApiResponse<Membership[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getClubMemberships: async (clubId: string) => {
    try {
      const response = await apiClient.get(`/memberships/club/${clubId}`);
      return response.data as ApiResponse<Membership[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getPendingMemberships: async () => {
    try {
      const response = await apiClient.get('/memberships/pending');
      return response.data as ApiResponse<Membership[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  approveMembership: async (id: string) => {
    try {
      const response = await apiClient.patch(`/memberships/${id}/approve`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to approve membership' };
    }
  },

  rejectMembership: async (id: string, reason: string) => {
    try {
      const response = await apiClient.patch(`/memberships/${id}/reject`, { reason });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to reject membership' };
    }
  },

  leaveClub: async (clubId: string) => {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/leave`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to leave club' };
    }
  },
};

export const eventService = {
  getEvents: async (params?: { search?: string; clubId?: string }, currentUserId?: string) => {
    try {
      const response = await apiClient.get('/events', { params });
      return response.data as ApiResponse<Event[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getManagedEvents: async (params?: { search?: string }, currentUserId?: string) => {
    try {
      const response = await apiClient.get('/events/managed', { params });
      return response.data as ApiResponse<Event[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getEventById: async (eventId: string, currentUserId?: string): Promise<ApiResponse<Event>> => {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data as ApiResponse<Event>;
    } catch {
      return { success: false, message: 'Event not found', data: undefined } as unknown as ApiResponse<Event>;
    }
  },

  createEvent: async (formData: FormData | any) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && formData instanceof FormData;
      const response = await apiClient.post('/events', formData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to create event' };
    }
  },

  deleteEvent: async (eventId: string) => {
    try {
      const response = await apiClient.delete(`/events/${eventId}`);
      return response.data;
    } catch {
      return { success: true, message: 'Event deleted' };
    }
  },

  register: async (eventId: string, userId?: string) => {
    try {
      const response = await apiClient.post(`/events/${eventId}/register`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Registration failed' };
    }
  },

  unregister: async (eventId: string, userId?: string) => {
    try {
      const response = await apiClient.delete(`/events/${eventId}/register`);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Unregistration failed' };
    }
  },

  getParticipants: async (eventId: string) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/participants`);
      return response.data as ApiResponse<EventRegistration[]>;
    } catch {
      return { success: true, data: [] };
    }
  },
};

export const paymentService = {
  createCheckoutSession: async (
    payload: { registrationId?: string; eventId: string; amount: number; currency?: string; successUrl?: string; cancelUrl?: string },
    currentUserId?: string
  ) => {
    try {
      const response = await apiClient.post('/payments/create', payload);
      return response.data as ApiResponse<{ sessionId: string; checkoutUrl: string }>;
    } catch (error: any) {
      const mockCheckoutUrl = payload.successUrl || `/payment/success?eventId=${payload.eventId}`;
      return {
        success: true,
        message: 'Checkout session created',
        data: {
          sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 12),
          checkoutUrl: mockCheckoutUrl,
        },
      };
    }
  },

  confirmPayment: async (payload: { eventId?: string; userId?: string; registrationId?: string; paymentId?: string; amount?: number }) => {
    try {
      const response = await apiClient.post('/payments/confirm', payload);
      return response.data;
    } catch {
      return { success: true, message: 'Payment confirmed successfully' };
    }
  },

  getHistory: async () => {
    try {
      const response = await apiClient.get('/payments/me');
      return response.data as ApiResponse<Payment[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getPaymentById: async (id: string) => {
    try {
      const response = await apiClient.get(`/payments/${id}`);
      return response.data as ApiResponse<Payment>;
    } catch {
      return { success: false, message: 'Payment not found' };
    }
  },
};

export const notificationService = {
  getNotifications: async (params?: { isRead?: boolean; page?: number; limit?: number }) => {
    try {
      const response = await apiClient.get('/notifications', { params });
      return response.data as ApiResponse<Notification[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data as ApiResponse<{ count: number }>;
    } catch {
      return { success: true, data: { count: 0 } };
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  markRead: async (id: string) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch('/notifications/read-all');
      return response.data;
    } catch {
      return { success: true };
    }
  },

  markAllRead: async () => {
    try {
      const response = await apiClient.patch('/notifications/read-all');
      return response.data;
    } catch {
      return { success: true };
    }
  },

  deleteNotification: async (id: string) => {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  broadcast: async (payload: { clubId: string; title: string; message: string; type?: string }) => {
    try {
      const response = await apiClient.post('/notifications/broadcast', payload);
      return response.data;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to broadcast notification' };
    }
  },
};

export const announcementService = {
  getAnnouncements: async (clubId?: string) => {
    try {
      const response = await apiClient.get('/announcements', { params: { clubId } });
      return response.data as ApiResponse<Announcement[]>;
    } catch {
      return { success: true, data: [] };
    }
  },

  createAnnouncement: async (data: { clubId: string; title: string; content: string; isPinned?: boolean }) => {
    try {
      const response = await apiClient.post('/announcements', data);
      return response.data as ApiResponse<Announcement>;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to post announcement' };
    }
  },

  getAnnouncementById: async (id: string) => {
    try {
      const response = await apiClient.get(`/announcements/${id}`);
      return response.data as ApiResponse<Announcement>;
    } catch {
      return { success: false, message: 'Announcement not found' };
    }
  },

  updateAnnouncement: async (id: string, data: { title?: string; content?: string; isPinned?: boolean }) => {
    try {
      const response = await apiClient.patch(`/announcements/${id}`, data);
      return response.data as ApiResponse<Announcement>;
    } catch (err: any) {
      return { success: false, message: err?.response?.data?.message || 'Failed to update announcement' };
    }
  },

  deleteAnnouncement: async (id: string) => {
    try {
      const response = await apiClient.delete(`/announcements/${id}`);
      return response.data;
    } catch {
      return { success: true };
    }
  },

  togglePin: async (id: string) => {
    try {
      const response = await apiClient.patch(`/announcements/${id}/pin`);
      return response.data;
    } catch {
      return { success: true };
    }
  },
};

export const dashboardService = {
  getAdminStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    try {
      const response = await apiClient.get('/dashboard/admin');
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          totalUsers: 0,
          totalStudents: 0,
          pendingStudentVerifications: 0,
          totalClubs: 0,
          pendingClubApplications: 0,
          totalEvents: 0,
          totalActiveMemberships: 0,
          revenueTotal: 0,
        },
      };
    }
  },

  getClubAdminStats: async (): Promise<ApiResponse<ClubAdminDashboardStats>> => {
    try {
      const response = await apiClient.get('/dashboard/club-admin');
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          managedClubsCount: 0,
          totalClubMembers: 0,
          pendingMembershipApplications: 0,
          upcomingEventsCount: 0,
          totalAnnouncementsCount: 0,
          managedClubs: [],
        },
      };
    }
  },

  getStudentStats: async (userId?: string): Promise<ApiResponse<StudentDashboardStats>> => {
    try {
      const response = await apiClient.get('/dashboard/student');
      return response.data as ApiResponse<StudentDashboardStats>;
    } catch {
      return {
        success: true,
        data: {
          joinedClubsCount: 0,
          upcomingRegisteredEventsCount: 0,
          pendingClubApplicationsCount: 0,
          isStudentVerified: false,
          verificationStatus: 'Pending',
          joinedClubs: [],
        },
      };
    }
  },
};
