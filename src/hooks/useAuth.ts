'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
    const { user, session, profile, propertyId, orgId, isLoading, signOut } = useAuthContext();

    return {
        user,
        session,
        profile,
        propertyId,
        orgId,
        isAuthenticated: !!user,
        isLoading,
        signOut,
    };
};
