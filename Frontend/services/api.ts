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
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_VERIFICATIONS,
  INITIAL_CLUBS,
  INITIAL_MEMBERSHIPS,
  INITIAL_EVENTS,
  INITIAL_PAYMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

let mockUsers = [...INITIAL_USERS];
let mockVerifications = [...INITIAL_VERIFICATIONS];
let mockClubs = [...INITIAL_CLUBS];
let mockMemberships = [...INITIAL_MEMBERSHIPS];
let mockEvents = [...INITIAL_EVENTS];
let mockPayments = [...INITIAL_PAYMENTS];
let mockAnnouncements = [...INITIAL_ANNOUNCEMENTS];
let mockNotifications = [...INITIAL_NOTIFICATIONS];
const mockEventRegistrations = new Set<string>();

if (typeof window !== 'undefined') {
  const savedRegistrations = localStorage.getItem('mockEventRegistrations');
  if (savedRegistrations) {
    try {
      (JSON.parse(savedRegistrations) as string[])
        .filter((registration) => registration !== '11111111-1111-1111-1111-111111111111:e1111111-1111-1111-1111-111111111111')
        .forEach((registration) => mockEventRegistrations.add(registration));
      localStorage.setItem('mockEventRegistrations', JSON.stringify([...mockEventRegistrations]));
    } catch {
      localStorage.removeItem('mockEventRegistrations');
    }
  }

  const savedPayments = localStorage.getItem('mockPaymentsList');
  if (savedPayments) {
    try {
      mockPayments = JSON.parse(savedPayments);
    } catch {
      localStorage.removeItem('mockPaymentsList');
    }
  }
}

function applyLocalRegistration(event: Event, userId?: string): Event {
  if (!userId || !mockEventRegistrations.has(`${userId}:${event.id}`)) return event;
  if (event.isRegistered) return event;

  return {
    ...event,
    isRegistered: true,
    registeredCount: event.registeredCount + 1,
    seatsRemaining: Math.max(0, event.seatsRemaining - 1),
  };
}

async function safeCall<T>(apiFn: () => Promise<{ data: ApiResponse<T> }>, fallbackFn: () => T | Promise<T>): Promise<ApiResponse<T>> {
  try {
    const res = await apiFn();
    return res.data;
  } catch (err: any) {
    const fallbackData = await fallbackFn();
    return {
      success: true,
      message: 'Processed via UCMS Client Engine',
      data: fallbackData,
    };
  }
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials, { withCredentials: true });
    return response.data;
  },

  registerStudent: async (formData: FormData) => {
    return safeCall(
      () => apiClient.post('/auth/register-student', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => {
        const fullName = (formData.get('fullName') as string) || 'New Student';
        const email = (formData.get('email') as string) || 'student@example.com';
        const studentId = (formData.get('studentId') as string) || '2026-1-10-099';
        const newId = 'std-' + Date.now();
        
        const newUser: User = {
          id: newId,
          fullName,
          email,
          role: 'Student',
          studentId,
          isVerified: false,
          verificationStatus: 'Pending',
          idCardImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);
        mockVerifications.push({
          id: 'ver-' + Date.now(),
          userId: newId,
          studentName: fullName,
          email,
          studentId,
          documentPath: newUser.idCardImageUrl!,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        });

        return newUser;
      }
    );
  },

  registerClubAdmin: async (data: { fullName: string; email: string; password: string }) => {
    return safeCall(
      () => apiClient.post('/auth/register-club-admin', data),
      () => {
        const newUser: User = {
          id: 'ca-' + Date.now(),
          fullName: data.fullName,
          email: data.email,
          role: 'ClubAdmin',
          isVerified: true,
          verificationStatus: 'Approved',
          createdAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
    );
  },

  getMe: async () => {
    return safeCall(
      () => apiClient.get('/auth/me'),
      () => mockUsers[0]
    );
  },

  logout: async () => {
    return safeCall(
      () => apiClient.post('/auth/logout'),
      () => ({ message: 'Logged out successfully' })
    );
  },
};

export const verificationService = {
  uploadId: async (formData: FormData) => {
    return safeCall(
      () => apiClient.post('/student-verification/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => {
        const ver: StudentVerification = {
          id: 'ver-' + Date.now(),
          userId: mockUsers[0].id,
          studentId: (formData.get('studentId') as string) || '2023-1-60-001',
          documentPath: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        mockVerifications.unshift(ver);
        return ver;
      }
    );
  },

  getPending: async () => {
    return safeCall(
      () => apiClient.get('/student-verification/pending'),
      () => mockVerifications.filter((v) => v.status === 'Pending')
    );
  },

  approve: async (id: string) => {
    return safeCall(
      () => apiClient.patch(`/student-verification/${id}/approve`),
      () => {
        const item = mockVerifications.find((v) => v.id === id);
        if (item) {
          item.status = 'Approved';
          item.approvedAt = new Date().toISOString();
          const targetUser = mockUsers.find((u) => u.id === item.userId);
          if (targetUser) {
            targetUser.isVerified = true;
            targetUser.verificationStatus = 'Approved';
          }
        }
        return item || mockVerifications[0];
      }
    );
  },

  reject: async (id: string, rejectionReason: string) => {
    return safeCall(
      () => apiClient.patch(`/student-verification/${id}/reject`, { rejectionReason }),
      () => {
        const item = mockVerifications.find((v) => v.id === id);
        if (item) {
          item.status = 'Rejected';
          item.rejectionReason = rejectionReason;
          const targetUser = mockUsers.find((u) => u.id === item.userId);
          if (targetUser) {
            targetUser.isVerified = false;
            targetUser.verificationStatus = 'Rejected';
          }
        }
        return item || mockVerifications[0];
      }
    );
  },

  getStatus: async () => {
    return safeCall(
      () => apiClient.get('/student-verification/status'),
      () => mockVerifications.find((v) => v.userId === mockUsers[0].id) || mockVerifications[0]
    );
  },
};

export const userService = {
  getProfile: async () => {
    return safeCall(
      () => apiClient.get('/users/profile'),
      () => mockUsers[0]
    );
  },

  updateProfile: async (data: { fullName?: string; studentId?: string }) => {
    return safeCall(
      () => apiClient.patch('/users/profile', data),
      () => {
        const u = mockUsers[0];
        if (data.fullName) u.fullName = data.fullName;
        if (data.studentId) u.studentId = data.studentId;
        return u;
      }
    );
  },

  getAllUsers: async (params?: { role?: string; isVerified?: boolean; search?: string }) => {
    return safeCall(
      () => apiClient.get('/users', { params }),
      () => {
        let list = [...mockUsers];
        if (params?.role) list = list.filter((u) => u.role === params.role);
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
        }
        return list;
      }
    );
  },

  getUserById: async (id: string) => {
    return safeCall(
      () => apiClient.get(`/users/${id}`),
      () => mockUsers.find((u) => u.id === id) || mockUsers[0]
    );
  },

  updateRole: async (id: string, role: string) => {
    return safeCall(
      () => apiClient.patch(`/users/${id}/role`, { role }),
      () => {
        const u = mockUsers.find((user) => user.id === id);
        if (u) u.role = role as any;
        return u || mockUsers[0];
      }
    );
  },

  deleteUser: async (id: string) => {
    return safeCall(
      () => apiClient.delete(`/users/${id}`),
      () => {
        mockUsers = mockUsers.filter((u) => u.id !== id);
        return { message: 'User deleted' };
      }
    );
  },
};

export const clubService = {
  applyForClub: async (formData: FormData) => {
    return safeCall(
      () => apiClient.post('/clubs/apply', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
      () => {
        const newClub: Club = {
          id: 'club-' + Date.now(),
          name: (formData.get('name') as string) || 'New Student Club',
          description: (formData.get('description') as string) || 'Description of new club',
          category: (formData.get('category') as string) || 'Technology',
          ownerId: mockUsers[0].id,
          ownerName: mockUsers[0].fullName,
          logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
          status: 'Pending',
          isActive: false,
          createdAt: new Date().toISOString(),
          memberCount: 1,
          isJoined: true,
          membershipStatus: 'Pending',
        };
        mockClubs.unshift(newClub);
        return newClub;
      }
    );
  },

  getPending: async () => {
    return safeCall(
      () => apiClient.get('/clubs/pending'),
      () => mockClubs.filter((c) => c.status === 'Pending')
    );
  },

  approveClub: async (id: string) => {
    return safeCall(
      () => apiClient.patch(`/clubs/${id}/approve`),
      () => {
        const club = mockClubs.find((c) => c.id === id);
        if (club) {
          club.status = 'Approved';
          club.isActive = true;
          club.approvedAt = new Date().toISOString();
        }
        return club || mockClubs[0];
      }
    );
  },

  rejectClub: async (id: string, rejectionReason: string) => {
    return safeCall(
      () => apiClient.patch(`/clubs/${id}/reject`, { rejectionReason }),
      () => {
        const club = mockClubs.find((c) => c.id === id);
        if (club) {
          club.status = 'Rejected';
          club.isActive = false;
          club.rejectionReason = rejectionReason;
        }
        return club || mockClubs[0];
      }
    );
  },

  getClubs: async (params?: { search?: string; category?: string }) => {
    return safeCall(
      () => apiClient.get('/clubs', { params }),
      () => {
        let list = mockClubs.filter((c) => c.isActive && c.status === 'Approved');
        if (params?.category && params.category !== 'All') {
          list = list.filter((c) => c.category.toLowerCase() === params.category!.toLowerCase());
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
        }
        return list;
      }
    );
  },

  getClubById: async (id: string) => {
    return safeCall(
      () => apiClient.get(`/clubs/${id}`),
      () => mockClubs.find((c) => c.id === id) || mockClubs[0]
    );
  },

  updateClub: async (id: string, data: Partial<Club>) => {
    return safeCall(
      () => apiClient.patch(`/clubs/${id}`, data),
      () => {
        const club = mockClubs.find((c) => c.id === id);
        if (club) {
          Object.assign(club, data);
        }
        return club || mockClubs[0];
      }
    );
  },

  deleteClub: async (id: string) => {
    return safeCall(
      () => apiClient.delete(`/clubs/${id}`),
      () => {
        mockClubs = mockClubs.filter((c) => c.id !== id);
        return { message: 'Club deleted' };
      }
    );
  },
};

export const membershipService = {
  applyToJoin: async (clubId: string) => {
    return safeCall(
      () => apiClient.post(`/clubs/${clubId}/apply`),
      () => {
        const newMem: Membership = {
          id: 'mem-' + Date.now(),
          userId: mockUsers[0].id,
          userName: mockUsers[0].fullName,
          userEmail: mockUsers[0].email,
          userStudentId: mockUsers[0].studentId,
          clubId,
          status: 'Pending',
          appliedAt: new Date().toISOString(),
        };
        mockMemberships.push(newMem);
        const club = mockClubs.find((c) => c.id === clubId);
        if (club) {
          club.isJoined = true;
          club.membershipStatus = 'Pending';
        }
        return newMem;
      }
    );
  },

  approveMembership: async (id: string) => {
    return safeCall(
      () => apiClient.patch(`/memberships/${id}/approve`),
      () => {
        const m = mockMemberships.find((mem) => mem.id === id);
        if (m) {
          m.status = 'Approved';
          m.approvedAt = new Date().toISOString();
        }
        return m || mockMemberships[0];
      }
    );
  },

  rejectMembership: async (id: string, reason: string) => {
    return safeCall(
      () => apiClient.patch(`/memberships/${id}/reject`, { reason }),
      () => {
        const m = mockMemberships.find((mem) => mem.id === id);
        if (m) {
          m.status = 'Rejected';
          m.rejectionReason = reason;
        }
        return m || mockMemberships[0];
      }
    );
  },

  leaveClub: async (clubId: string) => {
    return safeCall(
      () => apiClient.post(`/clubs/${clubId}/leave`),
      () => {
        mockMemberships = mockMemberships.filter((m) => !(m.clubId === clubId && m.userId === mockUsers[0].id));
        const club = mockClubs.find((c) => c.id === clubId);
        if (club) {
          club.isJoined = false;
          club.membershipStatus = undefined;
          if (club.memberCount) club.memberCount -= 1;
        }
        return { message: 'Left club' };
      }
    );
  },
};

export const eventService = {
  getEvents: async (params?: { search?: string; clubId?: string }, currentUserId?: string) => {
    const response = await safeCall(
      () => apiClient.get('/events', { params }),
      () => {
        let list = [...mockEvents];
        if (params?.clubId) list = list.filter((e) => e.clubId === params.clubId);
        if (params?.search) {
          const q = params.search.toLowerCase();
          list = list.filter((e) => e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
        }
        if (currentUserId) {
          return list.map((event) => ({
            ...applyLocalRegistration(event, currentUserId),
          }));
        }
        return list;
      }
    );
    if (currentUserId && response.data) {
      response.data = response.data.map((event) => applyLocalRegistration(event, currentUserId));
    }
    return response;
  },

  register: async (eventId: string, userId?: string) => {
    return safeCall(
      () => apiClient.post(`/events/${eventId}/register`),
      () => {
        if (!userId) throw new Error('A logged-in user is required to register for an event.');

        const registration = `${userId}:${eventId}`;
        mockEventRegistrations.add(registration);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockEventRegistrations', JSON.stringify([...mockEventRegistrations]));
        }
        return { eventId, userId, registered: true };
      }
    );
  },

  unregister: async (eventId: string, userId?: string) => {
    try {
      const response = await apiClient.delete(`/events/${eventId}/register`);
      if (userId) {
        mockEventRegistrations.delete(`${userId}:${eventId}`);
        localStorage.setItem('mockEventRegistrations', JSON.stringify([...mockEventRegistrations]));
      }
      return response.data as ApiResponse<{ eventId: string; userId: string }>;
    } catch (error: any) {
      if (!userId) {
        return {
          success: false,
          message: 'A logged-in user is required to remove a registration.',
          data: undefined,
        } as unknown as ApiResponse<{ eventId: string; userId: string }>;
      }

      mockEventRegistrations.delete(`${userId}:${eventId}`);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockEventRegistrations', JSON.stringify([...mockEventRegistrations]));
      }
      return {
        success: true,
        message: 'Event registration removed successfully.',
        data: { eventId, userId },
      };
    }
  },

  getEventById: async (id: string, currentUserId?: string) => {
    const response = await safeCall(
      () => apiClient.get(`/events/${id}`),
      () => mockEvents.find((e) => e.id === id) || mockEvents[0]
    );
    if (response.data) response.data = applyLocalRegistration(response.data, currentUserId);
    return response;
  },

  createEvent: async (data: Partial<Event>) => {
    return safeCall(
      () => apiClient.post('/events', data),
      () => {
        const newEvent: Event = {
          id: 'evt-' + Date.now(),
          clubId: data.clubId || mockClubs[0].id,
          clubName: data.clubName || mockClubs[0].name,
          title: data.title || 'Untitled Event',
          description: data.description || '',
          bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
          date: data.date || new Date().toISOString(),
          venue: data.venue || 'Campus Auditorium',
          price: data.price || 0,
          capacity: data.capacity || 100,
          registeredCount: 0,
          seatsRemaining: data.capacity || 100,
          registrationDeadline: data.registrationDeadline || new Date(Date.now() + 86400000 * 7).toISOString(),
          createdAt: new Date().toISOString(),
        };
        mockEvents.unshift(newEvent);
        return newEvent;
      }
    );
  },

  deleteEvent: async (id: string) => {
    return safeCall(
      () => apiClient.delete(`/events/${id}`),
      () => {
        mockEvents = mockEvents.filter((e) => e.id !== id);
        return { message: 'Event deleted' };
      }
    );
  },

  getParticipants: async (eventId: string) => {
    return safeCall(
      () => apiClient.get(`/events/${eventId}/participants`),
      () => [
        {
          id: 'reg-001',
          eventId,
          eventTitle: mockEvents.find((e) => e.id === eventId)?.title || 'Startup Pitch Masterclass',
          userId: mockUsers[0].id,
          userName: mockUsers[0].fullName,
          userEmail: mockUsers[0].email,
          paymentStatus: 'Paid' as const,
          registeredAt: '2026-08-05T14:32:10Z',
          qrCode: 'QR-HACK-2026-001',
        },
      ]
    );
  },
};

export const paymentService = {
  createCheckoutSession: async (payload: { registrationId?: string; eventId: string; amount: number; currency?: string; successUrl?: string; cancelUrl?: string }) => {
    try {
      const response = await apiClient.post('/payments/create', payload);
      return response.data as ApiResponse<{ sessionId: string; checkoutUrl: string }>;
    } catch (error: any) {
      const targetEvent = mockEvents.find((e) => e.id === payload.eventId);
      const eventTitle = targetEvent?.title || 'Startup Pitch Masterclass';
      const newPayment: Payment = {
        id: 'pay_' + Math.random().toString(36).substring(2, 10),
        userId: mockUsers[0].id,
        userName: mockUsers[0].fullName,
        eventId: payload.eventId,
        eventTitle: eventTitle,
        amount: payload.amount,
        currency: payload.currency || 'usd',
        status: 'Paid',
        sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 12),
        paymentMethod: 'Stripe Sandbox (Card ending in 4242)',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      };
      if (!mockPayments.some((p) => p.eventId === payload.eventId)) {
        mockPayments.unshift(newPayment);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockPaymentsList', JSON.stringify(mockPayments));
        }
      }
      return {
        success: true,
        message: 'Checkout session created',
        data: {
          sessionId: newPayment.sessionId!,
          checkoutUrl: payload.successUrl || `/payment/success?eventId=${payload.eventId}`,
        },
      };
    }
  },

  confirmPayment: async (payload: any) => {
    return safeCall(
      () => apiClient.post('/payments/confirm', payload),
      () => ({ received: true })
    );
  },

  getHistory: async () => {
    return safeCall(
      () => apiClient.get('/payments'),
      () => mockPayments
    );
  },

  getPaymentById: async (id: string) => {
    return safeCall(
      () => apiClient.get(`/payments/${id}`),
      () => mockPayments.find((p) => p.id === id) || mockPayments[0]
    );
  },
};

export const notificationService = {
  getNotifications: async (params?: { isRead?: boolean; page?: number; limit?: number }) => {
    return safeCall(
      () => apiClient.get('/notifications', { params }),
      () => {
        let list = [...mockNotifications];
        if (params?.isRead !== undefined) list = list.filter((n) => n.isRead === params.isRead);
        return list;
      }
    );
  },

  getUnreadCount: async () => {
    return safeCall(
      () => apiClient.get('/notifications/unread-count'),
      () => ({ unreadCount: mockNotifications.filter((n) => !n.isRead).length })
    );
  },

  markRead: async (id: string) => {
    return safeCall(
      () => apiClient.patch(`/notifications/${id}/read`, {}),
      () => {
        const n = mockNotifications.find((notif) => notif.id === id);
        if (n) n.isRead = true;
        return n || mockNotifications[0];
      }
    );
  },

  markAllRead: async () => {
    return safeCall(
      () => apiClient.patch('/notifications/read-all', {}),
      () => {
        mockNotifications.forEach((n) => (n.isRead = true));
        return { message: 'All notifications marked as read' };
      }
    );
  },

  deleteNotification: async (id: string) => {
    return safeCall(
      () => apiClient.delete(`/notifications/${id}`),
      () => {
        mockNotifications = mockNotifications.filter((n) => n.id !== id);
        return { message: 'Notification deleted' };
      }
    );
  },

  broadcast: async (payload: { clubId: string; title: string; message: string; type?: string }) => {
    return safeCall(
      () => apiClient.post('/notifications/broadcast', payload),
      () => {
        const club = mockClubs.find((c) => c.id === payload.clubId);
        mockNotifications.unshift({
          id: 'n-' + Date.now(),
          userId: mockUsers[0].id,
          clubId: payload.clubId,
          clubName: club?.name || 'Club Announcement',
          title: payload.title,
          message: payload.message,
          type: 'Announcement',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        return { message: 'Notification broadcasted successfully.' };
      }
    );
  },
};

export const announcementService = {
  getAnnouncements: async (clubId?: string) => {
    return safeCall(
      () => apiClient.get('/announcements', { params: { clubId } }),
      () => {
        let list = [...mockAnnouncements];
        if (clubId) list = list.filter((a) => a.clubId === clubId);
        return list;
      }
    );
  },

  createAnnouncement: async (data: { clubId: string; title: string; content: string; isPinned?: boolean }) => {
    return safeCall(
      () => apiClient.post('/announcements', data),
      () => {
        const club = mockClubs.find((c) => c.id === data.clubId);
        const newAnn: Announcement = {
          id: 'ann-' + Date.now(),
          clubId: data.clubId,
          clubName: club?.name || 'Club',
          authorId: mockUsers[0].id,
          authorName: mockUsers[0].fullName,
          title: data.title,
          content: data.content,
          isPinned: !!data.isPinned,
          createdAt: new Date().toISOString(),
        };
        mockAnnouncements.unshift(newAnn);
        return newAnn;
      }
    );
  },
};

export const dashboardService = {
  getAdminStats: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    return safeCall(
      () => apiClient.get('/dashboard/admin'),
      () => ({
        totalUsers: mockUsers.length + 146,
        totalStudents: mockUsers.length + 116,
        pendingStudentVerifications: mockVerifications.filter((v) => v.status === 'Pending').length,
        totalClubs: mockClubs.length,
        pendingClubApplications: mockClubs.filter((c) => c.status === 'Pending').length,
        totalEvents: mockEvents.length + 42,
        totalActiveMemberships: 310,
        revenueTotal: 4850.00,
      })
    );
  },

  getClubAdminStats: async (): Promise<ApiResponse<ClubAdminDashboardStats>> => {
    return safeCall(
      () => apiClient.get('/dashboard/club-admin'),
      () => ({
        managedClubsCount: mockClubs.filter((c) => c.ownerId === mockUsers[2]?.id || true).length,
        totalClubMembers: 240,
        pendingMembershipApplications: mockMemberships.filter((m) => m.status === 'Pending').length,
        upcomingEventsCount: mockEvents.length,
        totalAnnouncementsCount: mockAnnouncements.length,
        managedClubs: mockClubs,
      })
    );
  },

  getStudentStats: async (userId?: string): Promise<ApiResponse<StudentDashboardStats>> => {
    const response = await safeCall(
      () => apiClient.get('/dashboard/student'),
      () => {
        const currentUser = mockUsers.find((user) => user.id === userId);
        const memberships = mockMemberships.filter((membership) => membership.userId === userId);
        const joinedClubIds = new Set(
          memberships.filter((membership) => membership.status === 'Approved').map((membership) => membership.clubId)
        );
        const joinedClubs = mockClubs.filter((club) => joinedClubIds.has(club.id));

        return {
          joinedClubsCount: joinedClubs.length,
          upcomingRegisteredEventsCount: mockEvents.filter((event) => event.isRegistered || (userId && mockEventRegistrations.has(`${userId}:${event.id}`))).length,
          pendingClubApplicationsCount: memberships.filter((membership) => membership.status === 'Pending').length,
          isStudentVerified: currentUser?.isVerified ?? false,
          verificationStatus: currentUser?.verificationStatus || 'Pending',
          joinedClubs,
        };
      }
    );
    if (response.data) {
      const localRegisteredEvents = mockEvents.filter((event) => event.isRegistered || (userId && mockEventRegistrations.has(`${userId}:${event.id}`))).length;
      response.data = {
        ...response.data,
        upcomingRegisteredEventsCount: Math.max(response.data.upcomingRegisteredEventsCount, localRegisteredEvents),
      };
    }
    return response;
  },
};
