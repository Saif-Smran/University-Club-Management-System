import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'University Club Management System (UCMS)',
  description: 'Manage university clubs, student memberships, events, announcements, notifications, and paid event registrations with Stripe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-secondary/20 selection:text-secondary">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
