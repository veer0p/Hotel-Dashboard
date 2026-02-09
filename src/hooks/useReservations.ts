import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Reservation, CreateReservationDTO, ReservationFilters } from '@/shared/types';

/**
 * Hook for fetching and managing reservations
 */
export const useReservations = (propertyId?: string, filters: ReservationFilters = {}) => {
    const queryClient = useQueryClient();

    // Fetch reservations
    const {
        data: reservations,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['reservations', propertyId, filters],
        queryFn: async () => {
            if (!propertyId) return [];

            const params = new URLSearchParams();
            params.append('property_id', propertyId);

            if (filters.status) {
                params.append('status', Array.isArray(filters.status) ? filters.status.join(',') : filters.status);
            }
            if (filters.check_in_date_from) params.append('check_in_date_from', filters.check_in_date_from);
            if (filters.check_in_date_to) params.append('check_in_date_to', filters.check_in_date_to);

            const response = await apiClient.get<{ data: Reservation[] }>(`/reservations?${params.toString()}`);
            return response.data.data;
        },
        enabled: !!propertyId,
    });

    // Check-in mutation
    const checkInMutation = useMutation({
        mutationFn: async (reservationId: string) => {
            const response = await apiClient.post(`/reservations/${reservationId}/check-in`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });

    // Check-out mutation
    const checkOutMutation = useMutation({
        mutationFn: async (reservationId: string) => {
            const response = await apiClient.post(`/reservations/${reservationId}/check-out`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });

    // Create reservation mutation
    const createReservationMutation = useMutation({
        mutationFn: async (newReservation: CreateReservationDTO) => {
            const response = await apiClient.post<{ data: Reservation }>('/reservations', newReservation);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
        },
    });

    return {
        reservations,
        isLoading,
        error,
        refetch,
        checkIn: checkInMutation.mutateAsync,
        isCheckingIn: checkInMutation.isPending,
        checkOut: checkOutMutation.mutateAsync,
        isCheckingOut: checkOutMutation.isPending,
        createReservation: createReservationMutation.mutateAsync,
        isCreating: createReservationMutation.isPending,
    };
};
