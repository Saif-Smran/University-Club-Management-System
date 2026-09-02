import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').max(255, 'Email must be 255 characters or fewer').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const studentRegistrationSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Full name must be 100 characters or fewer'),
  email: z.string().trim().min(1, 'Email is required').max(255, 'Email must be 255 characters or fewer').email('Enter a valid email address'),
  studentId: z.string().trim().min(1, 'Student ID is required').max(50, 'Student ID must be 50 characters or fewer'),
  password: z.string().min(1, 'Password is required'),
});

export function validateStudentIdImage(file: File | null) {
  if (!file) return 'Student ID photo is required';
  if (!file.type.startsWith('image/')) return 'Student ID photo must be an image';
  if (file.size > 5 * 1024 * 1024) return 'Student ID photo must be 5 MB or smaller';
  return null;
}