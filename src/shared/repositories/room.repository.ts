// Supabase Room Repository Implementation

import { SupabaseClient } from '@supabase/supabase-js';
import { IRoomRepository } from '../interfaces/room.repository.interface';
import {
    Room,
    RoomWithType,
    RoomType,
    UpdateRoomDTO,
    RoomFilters,
    RoomStatus,
    RoomAvailability
} from '../types/room.types';

export class RoomRepository implements IRoomRepository {
    constructor(private supabase: SupabaseClient) { }

    async findById(id: string): Promise<Room | null> {
        const { data, error } = await this.supabase
            .from('rooms')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to find room: ${error.message}`);
        }
        return data;
    }

    async findByIdWithType(id: string): Promise<RoomWithType | null> {
        const { data, error } = await this.supabase
            .from('rooms')
            .select(`
        *,
        room_type:room_types(*),
        floor:floors(*)
      `)
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to find room with type: ${error.message}`);
        }
        return data;
    }

    async findByProperty(propertyId: string, filters?: RoomFilters): Promise<RoomWithType[]> {
        let query = this.supabase
            .from('rooms')
            .select(`
        *,
        room_type:room_types(*),
        floor:floors(*)
      `)
            .eq('property_id', propertyId);

        if (filters?.status) {
            if (Array.isArray(filters.status)) {
                query = query.in('status', filters.status);
            } else {
                query = query.eq('status', filters.status);
            }
        }

        if (filters?.room_type_id) {
            query = query.eq('room_type_id', filters.room_type_id);
        }

        if (filters?.floor_id) {
            query = query.eq('floor_id', filters.floor_id);
        }

        if (filters?.is_active !== undefined) {
            query = query.eq('is_active', filters.is_active);
        }

        const { data, error } = await query.order('room_number', { ascending: true });

        if (error) throw new Error(`Failed to fetch rooms: ${error.message}`);
        return data || [];
    }

    async updateStatus(id: string, status: RoomStatus): Promise<void> {
        const { error } = await this.supabase
            .from('rooms')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw new Error(`Failed to update room status: ${error.message}`);
    }

    async update(id: string, data: UpdateRoomDTO): Promise<Room> {
        const { data: room, error } = await this.supabase
            .from('rooms')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Failed to update room: ${error.message}`);
        return room;
    }

    async assignToReservation(roomId: string, reservationId: string): Promise<void> {
        const { error } = await this.supabase
            .from('rooms')
            .update({
                current_reservation_id: reservationId,
                status: 'occupied',
                updated_at: new Date().toISOString(),
            })
            .eq('id', roomId);

        if (error) throw new Error(`Failed to assign room: ${error.message}`);
    }

    async clearReservation(roomId: string): Promise<void> {
        const { error } = await this.supabase
            .from('rooms')
            .update({
                current_reservation_id: null,
                status: 'dirty',
                updated_at: new Date().toISOString(),
            })
            .eq('id', roomId);

        if (error) throw new Error(`Failed to clear room reservation: ${error.message}`);
    }

    async getAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<RoomAvailability[]> {
        // Get all rooms for the property
        const { data: rooms, error: roomsError } = await this.supabase
            .from('rooms')
            .select(`
        id,
        room_number,
        status,
        room_type:room_types(name)
      `)
            .eq('property_id', propertyId)
            .eq('is_active', true);

        if (roomsError) throw new Error(`Failed to fetch rooms: ${roomsError.message}`);

        // Get reservations overlapping with the date range
        const { data: reservations, error: resError } = await this.supabase
            .from('reservations')
            .select('room_id')
            .eq('property_id', propertyId)
            .in('status', ['confirmed', 'checked_in'])
            .or(`and(check_in_date.lte.${checkOut},check_out_date.gte.${checkIn})`);

        if (resError) throw new Error(`Failed to fetch reservations: ${resError.message}`);

        const bookedRoomIds = new Set((reservations || []).map((r: any) => r.room_id));

        return (rooms || []).map((room: any) => ({
            room_id: room.id,
            room_number: room.room_number,
            room_type: room.room_type?.name || 'Unknown',
            is_available: !bookedRoomIds.has(room.id) && room.status === 'vacant',
            current_status: room.status,
        }));
    }

    async getRoomTypes(propertyId: string): Promise<RoomType[]> {
        const { data, error } = await this.supabase
            .from('room_types')
            .select('*')
            .eq('property_id', propertyId)
            .eq('is_active', true)
            .order('name', { ascending: true });

        if (error) throw new Error(`Failed to fetch room types: ${error.message}`);
        return data || [];
    }
}
