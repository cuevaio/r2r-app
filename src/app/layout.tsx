import * as React from 'react';

import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/lib/utils';

import { Providers } from './providers';

import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        scrollbarGutter: 'stable',
      }}
    >
      <head />
      <body
        className={cn(
          'container mt-4 min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
