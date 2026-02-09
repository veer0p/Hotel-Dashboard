// Room Repository Interface

import {
    Room,
    RoomWithType,
    RoomType,
    UpdateRoomDTO,
    RoomFilters,
    RoomStatus,
    RoomAvailability
} from '../types/room.types';

export interface IRoomRepository {
    /**
     * Find room by ID
     */
    findById(id: string): Promise<Room | null>;

    /**
     * Find room with type information
     */
    findByIdWithType(id: string): Promise<RoomWithType | null>;

    /**
     * Find rooms by property with optional filters
     */
    findByProperty(propertyId: string, filters?: RoomFilters): Promise<RoomWithType[]>;

    /**
     * Update room status
     */
    updateStatus(id: string, status: RoomStatus): Promise<void>;

    /**
     * Update room fields
     */
    update(id: string, data: UpdateRoomDTO): Promise<Room>;

    /**
     * Assign room to reservation
     */
    assignToReservation(roomId: string, reservationId: string): Promise<void>;

    /**
     * Clear room assignment
     */
    clearReservation(roomId: string): Promise<void>;

    /**
     * Get room availability for date range
     */
    getAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<RoomAvailability[]>;

    /**
     * Get all room types for a property
     */
    getRoomTypes(propertyId: string): Promise<RoomType[]>;
}
