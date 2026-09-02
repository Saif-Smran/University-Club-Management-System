'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { GraduationCap, Upload, CheckCircle2, User, Mail, Lock, IdCard, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { studentRegistrationSchema, validateStudentIdImage } from '@/lib/validation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const fileError = validateStudentIdImage(selected);
      if (fileError) {
        toast.error(fileError);
        e.target.value = '';
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = studentRegistrationSchema.safeParse({ fullName, email, studentId, password });
    const fileError = validateStudentIdImage(file);
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Please check your details');
      return;
    }
    if (fileError) {
      toast.error(fileError);
      return;
    }
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('studentId', studentId.trim());
      formData.append('password', password);
      formData.append('idCardImage', file);

      await authService.registerStudent(formData);
      toast.success('Registration submitted for admin review!');
      setIsSubmitted(true);
    } catch (err) {
      toast.error('Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-card text-card-foreground border border-border/80 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-foreground">Verification Submitted!</h2>
          <div className="p-4 rounded-2xl bg-muted/60 border border-border/60 text-xs text-muted-foreground leading-relaxed space-y-2">
            <p className="font-semibold text-foreground">
              Your account and student ID photo have been submitted for review.
            </p>
            <p>
              Please wait for admin verification approval before logging in.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full inline-block py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all"
          >
            Return to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-card text-card-foreground border border-border/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Student Account Registration</h1>
          <p className="text-xs text-muted-foreground">Submit your student ID card photo for admin verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">University Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@university.edu"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Student ID Number</label>
            <div className="relative">
              <IdCard className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2023-1-60-001"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Student ID Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Student ID Card Photo (Cloudinary Upload)</label>
            {previewUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-border bg-black max-h-48 flex items-center justify-center p-2">
                <img src={previewUrl} alt="ID Preview" className="max-h-44 object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-secondary bg-muted/30 cursor-pointer transition-colors text-center">
                <Upload className="w-8 h-8 text-secondary mb-2" />
                <span className="text-xs font-semibold text-foreground">Click to upload Student ID Photo</span>
                <span className="text-[10px] text-muted-foreground mt-1">Supports JPG, PNG, WEBP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold bg-secondary text-secondary-foreground hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting Registration...' : 'Submit Student Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/40">
          <span>Already registered? </span>
          <Link href="/login" className="font-bold text-secondary hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
