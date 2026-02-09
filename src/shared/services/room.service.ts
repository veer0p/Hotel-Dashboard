// Room Service - Pure Business Logic

import { IRoomRepository } from '../interfaces/room.repository.interface';
import {
    Room,
    RoomWithType,
    RoomType,
    RoomFilters,
    RoomStatus,
    RoomAvailability
} from '../types/room.types';

export class RoomService {
    constructor(private roomRepo: IRoomRepository) { }

    /**
     * Get room by ID
     */
    async getRoom(id: string): Promise<RoomWithType | null> {
        return this.roomRepo.findByIdWithType(id);
    }

    /**
     * Get all rooms for a property
     */
    async getRooms(propertyId: string, filters?: RoomFilters): Promise<RoomWithType[]> {
        return this.roomRepo.findByProperty(propertyId, filters);
    }

    /**
     * Get room types for a property
     */
    async getRoomTypes(propertyId: string): Promise<RoomType[]> {
        return this.roomRepo.getRoomTypes(propertyId);
    }

    /**
     * Update room status
     */
    async updateRoomStatus(roomId: string, status: RoomStatus): Promise<void> {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Business rule: Cannot change status of occupied room (except housekeeping)
        if (room.status === 'occupied' && status !== 'dirty') {
            throw new Error('Cannot change status of occupied room');
        }

        await this.roomRepo.updateStatus(roomId, status);
    }

    /**
     * Mark room as clean
     */
    async markRoomClean(roomId: string): Promise<void> {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Business rule: Can only clean dirty rooms
        if (room.status !== 'dirty') {
            throw new Error(`Room is not dirty (current status: ${room.status})`);
        }

        await this.roomRepo.updateStatus(roomId, 'vacant');
    }

    /**
     * Put room out of order
     */
    async markOutOfOrder(roomId: string, reason?: string): Promise<void> {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Business rule: Cannot put occupied room out of order
        if (room.status === 'occupied') {
            throw new Error('Cannot put occupied room out of order');
        }

        await this.roomRepo.updateStatus(roomId, 'out_of_order');

        // TODO: Log the reason in room_status_logs
    }

    /**
     * Put room in maintenance
     */
    async markForMaintenance(roomId: string): Promise<void> {
        const room = await this.roomRepo.findById(roomId);
        if (!room) {
            throw new Error('Room not found');
        }

        // Business rule: Cannot put occupied room in maintenance
        if (room.status === 'occupied') {
            throw new Error('Cannot put occupied room in maintenance');
        }

        await this.roomRepo.updateStatus(roomId, 'maintenance');
    }

    /**
     * Check room availability for date range
     */
    async checkAvailability(
        propertyId: string,
        checkIn: string,
        checkOut: string
    ): Promise<RoomAvailability[]> {
        return this.roomRepo.getAvailability(propertyId, checkIn, checkOut);
    }

    /**
     * Get available rooms for date range
     */
    async getAvailableRooms(
        propertyId: string,
        checkIn: string,
        checkOut: string
    ): Promise<RoomAvailability[]> {
        const availability = await this.roomRepo.getAvailability(propertyId, checkIn, checkOut);
        return availability.filter(room => room.is_available);
    }

    /**
     * Get room statistics for a property
     */
    async getRoomStats(propertyId: string): Promise<{
        total: number;
        vacant: number;
        occupied: number;
        dirty: number;
        maintenance: number;
        outOfOrder: number;
    }> {
        const rooms = await this.roomRepo.findByProperty(propertyId, { is_active: true });

        return {
            total: rooms.length,
            vacant: rooms.filter(r => r.status === 'vacant').length,
            occupied: rooms.filter(r => r.status === 'occupied').length,
            dirty: rooms.filter(r => r.status === 'dirty').length,
            maintenance: rooms.filter(r => r.status === 'maintenance').length,
            outOfOrder: rooms.filter(r => r.status === 'out_of_order').length,
        };
    }
}
