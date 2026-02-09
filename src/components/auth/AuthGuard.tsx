'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            const isAuthPage = pathname.startsWith('/auth');

            if (!user && !isAuthPage) {
                // Not logged in and trying to access a protected page
                router.push('/auth');
            } else if (user && isAuthPage) {
                // Logged in and trying to access an auth page
                router.push('/');
            }
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Handle protected route visibility during redirect
    const isAuthPage = pathname.startsWith('/auth');
    if (!user && !isAuthPage) return null;
    if (user && isAuthPage) return null;

    return <>{children}</>;
};
