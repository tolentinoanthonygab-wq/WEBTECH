import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import './globals.css';

export const metadata = {
  title: 'WeLaund - Laundry Management',
  description: 'Professional SaaS Laundry Management System',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <AuthProvider>
            <PageTransition>{children}</PageTransition>
          </AuthProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

