// Reservation Service - Pure Business Logic
// No Supabase imports here! Only works with repository interfaces.

import { IReservationRepository } from '../interfaces/reservation.repository.interface';
import { IRoomRepository } from '../interfaces/room.repository.interface';
import {
    Reservation,
    CreateReservationDTO,
    ReservationFilters
} from '../types/reservation.types';

export interface CheckInResult {
    success: boolean;
    roomNumber: string;
    message: string;
}

export interface CheckOutResult {
    success: boolean;
    message: string;
    balanceDue: number;
}

export class ReservationService {
    constructor(
        private reservationRepo: IReservationRepository,
        private roomRepo: IRoomRepository
    ) { }

    /**
     * Create a new reservation
     */
    async createReservation(data: CreateReservationDTO): Promise<Reservation> {
        // Business rule: Check room availability
        if (data.room_id) {
            const room = await this.roomRepo.findById(data.room_id);
            if (!room) {
                throw new Error('Room not found');
            }
            if (room.status === 'out_of_order' || room.status === 'maintenance') {
                throw new Error('Room is not available for booking');
            }
        }

        // Business rule: Check dates
        const checkIn = new Date(data.check_in_date);
        const checkOut = new Date(data.check_out_date);

        if (checkOut <= checkIn) {
            throw new Error('Check-out date must be after check-in date');
        }

        return this.reservationRepo.create(data);
    }

    /**
     * Get reservation by ID
     */
    async getReservation(id: string): Promise<Reservation | null> {
        return this.reservationRepo.findById(id);
    }

    /**
     * Get reservations for a property
     */
    async getReservations(propertyId: string, filters?: ReservationFilters): Promise<Reservation[]> {
        return this.reservationRepo.findByProperty(propertyId, filters);
    }

    /**
     * Get today's arrivals
     */
    async getTodayArrivals(propertyId: string): Promise<Reservation[]> {
        return this.reservationRepo.findTodayArrivals(propertyId);
    }

    /**
     * Get today's departures
     */
    async getTodayDepartures(propertyId: string): Promise<Reservation[]> {
        return this.reservationRepo.findTodayDepartures(propertyId);
    }

    /**
     * Check in a guest
     */
    async checkIn(reservationId: string): Promise<CheckInResult> {
        const reservation = await this.reservationRepo.findById(reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Can only check in confirmed reservations
        if (reservation.status !== 'confirmed') {
            throw new Error(`Cannot check in: Reservation is ${reservation.status}`);
        }

        // Business rule: Must have a room assigned
        if (!reservation.room_id) {
            throw new Error('Cannot check in: No room assigned to reservation');
        }

        // Business rule: Check if check-in date is today or earlier
        const today = new Date().toISOString().split('T')[0];
        if (reservation.check_in_date > today) {
            throw new Error('Cannot check in: Check-in date is in the future');
        }

        // Update reservation status
        await this.reservationRepo.recordCheckIn(reservationId);

        // Update room status to occupied
        await this.roomRepo.assignToReservation(reservation.room_id, reservationId);

        const room = await this.roomRepo.findById(reservation.room_id);

        return {
            success: true,
            roomNumber: room?.room_number || 'Unknown',
            message: `Guest checked in to room ${room?.room_number}`,
        };
    }

    /**
     * Check out a guest
     */
    async checkOut(reservationId: string): Promise<CheckOutResult> {
        const reservation = await this.reservationRepo.findById(reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Can only check out checked-in guests
        if (reservation.status !== 'checked_in') {
            throw new Error(`Cannot check out: Guest is not checked in (status: ${reservation.status})`);
        }

        // Business rule: Check balance
        if (reservation.balance_due > 0) {
            // Warning but allow checkout - you may want to enforce this
            console.warn(`Guest checking out with balance due: $${reservation.balance_due}`);
        }

        // Update reservation status
        await this.reservationRepo.recordCheckOut(reservationId);

        // Update room status to dirty (needs cleaning)
        if (reservation.room_id) {
            await this.roomRepo.clearReservation(reservation.room_id);
        }

        return {
            success: true,
            message: 'Guest checked out successfully',
            balanceDue: reservation.balance_due,
        };
    }

    /**
     * Cancel a reservation
     */
    async cancelReservation(reservationId: string, reason?: string): Promise<void> {
        const reservation = await this.reservationRepo.findById(reservationId);

        if (!reservation) {
            throw new Error('Reservation not found');
        }

        // Business rule: Cannot cancel checked-in or checked-out reservations
        if (reservation.status === 'checked_in') {
            throw new Error('Cannot cancel: Guest is already checked in');
        }
        if (reservation.status === 'checked_out') {
            throw new Error('Cannot cancel: Reservation already completed');
        }

        await this.reservationRepo.updateStatus(reservationId, 'cancelled');

        // Clear room assignment if any
        if (reservation.room_id) {
            await this.roomRepo.update(reservation.room_id, { status: 'vacant' });
        }
    }
}
