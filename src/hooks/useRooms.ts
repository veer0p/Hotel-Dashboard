import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { RoomWithType, RoomStatus, RoomFilters, RoomAvailability } from '@/shared/types';

/**
 * Hook for managing rooms and availability
 */
export const useRooms = (propertyId?: string, filters: RoomFilters = {}) => {
    const queryClient = useQueryClient();

    // Fetch rooms
    const {
        data: rooms,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['rooms', propertyId, filters],
        queryFn: async () => {
            if (!propertyId) return [];

            const params = new URLSearchParams();
            params.append('property_id', propertyId);

            if (filters.status) {
                params.append('status', Array.isArray(filters.status) ? filters.status.join(',') : filters.status);
            }
            if (filters.room_type_id) params.append('room_type_id', filters.room_type_id);

            const response = await apiClient.get<{ data: RoomWithType[] }>(`/rooms?${params.toString()}`);
            return response.data.data;
        },
        enabled: !!propertyId,
    });

    // Update room status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ roomId, status }: { roomId: string; status: RoomStatus }) => {
            const response = await apiClient.patch(`/rooms/${roomId}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        },
    });

    /**
     * Check availability for a date range
     */
    const checkAvailability = async (checkIn: string, checkOut: string): Promise<RoomAvailability[]> => {
        if (!propertyId) return [];

        const params = new URLSearchParams();
        params.append('property_id', propertyId);
        params.append('check_availability', 'true');
        params.append('check_in', checkIn);
        params.append('check_out', checkOut);

        const response = await apiClient.get<{ data: RoomAvailability[] }>(`/rooms?${params.toString()}`);
        return response.data.data;
    };

    return {
        rooms,
        isLoading,
        error,
        refetch,
        updateStatus: updateStatusMutation.mutateAsync,
        isUpdating: updateStatusMutation.isPending,
        checkAvailability,
    };
};
