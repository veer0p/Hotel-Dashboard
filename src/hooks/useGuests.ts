import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Guest, CreateGuestDTO, GuestFilters } from '@/shared/types';

/**
 * Hook for fetching and managing guests
 */
export const useGuests = (propertyId?: string, filters: GuestFilters = {}, limit: number = 50) => {
    const queryClient = useQueryClient();

    // Fetch guests
    const {
        data: guests,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['guests', propertyId, filters, limit],
        queryFn: async () => {
            if (!propertyId) return [];

            const params = new URLSearchParams();
            params.append('property_id', propertyId);

            if (filters.search) params.append('search', filters.search);
            if (filters.vip_only) params.append('vip_only', 'true');
            if (filters.loyalty_tier) params.append('loyalty_tier', filters.loyalty_tier);
            params.append('limit', limit.toString());

            const response = await apiClient.get<{ data: Guest[] }>(`/guests?${params.toString()}`);
            return response.data.data;
        },
        enabled: !!propertyId,
    });

    // Create guest mutation
    const createGuestMutation = useMutation({
        mutationFn: async (newGuest: CreateGuestDTO) => {
            const response = await apiClient.post<{ data: Guest }>('/guests', newGuest);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guests'] });
        },
    });

    return {
        guests,
        isLoading,
        error,
        refetch,
        createGuest: createGuestMutation.mutateAsync,
        isCreating: createGuestMutation.isPending,
    };
};
