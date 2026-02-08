import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/lib/query-provider";
import { SocketProvider } from "@/lib/socket-provider";
import { UIStateProvider } from "@/lib/ui-state-context";
import { AppThemeProvider } from "@/components/layout/AppThemeProvider";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel PMS SaaS",
  description: "Modern Hotel Property Management System",
};

import ErrorBoundary from "@/components/layout/ErrorBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AppRouterCacheProvider>
          <UIStateProvider>
            <AppThemeProvider>
              <ReactQueryProvider>
                <SocketProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </SocketProvider>
              </ReactQueryProvider>
            </AppThemeProvider>
          </UIStateProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

