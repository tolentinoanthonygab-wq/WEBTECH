import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import './globals.css';

export const metadata = {
  title: 'WashWise — Smart Laundry Management',
  description: 'WashWise is a modern SaaS laundry management platform for shops and customers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/landing.css" />
      </head>
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

