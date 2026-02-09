'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
    const { user, session, isLoading, signOut } = useAuthContext();

    return {
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        signOut,
    };
};
