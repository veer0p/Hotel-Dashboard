// Reservation Repository Interface
// This interface defines the contract for reservation data access
// Can be implemented by Supabase, Prisma, or any other data provider

import {
    Reservation,
    CreateReservationDTO,
    UpdateReservationDTO,
    ReservationFilters,
    ReservationStatus
} from '../types/reservation.types';

export interface IReservationRepository {
    /**
     * Create a new reservation
     */
    create(data: CreateReservationDTO): Promise<Reservation>;

    /**
     * Find reservation by ID
     */
    findById(id: string): Promise<Reservation | null>;

    /**
     * Find reservations by property with optional filters
     */
    findByProperty(propertyId: string, filters?: ReservationFilters): Promise<Reservation[]>;

    /**
     * Find today's arrivals for a property
     */
    findTodayArrivals(propertyId: string): Promise<Reservation[]>;

    /**
     * Find today's departures for a property
     */
    findTodayDepartures(propertyId: string): Promise<Reservation[]>;

    /**
     * Update reservation status
     */
    updateStatus(id: string, status: ReservationStatus): Promise<void>;

    /**
     * Update reservation fields
     */
    update(id: string, data: UpdateReservationDTO): Promise<Reservation>;

    /**
     * Record actual check-in time
     */
    recordCheckIn(id: string): Promise<void>;

    /**
     * Record actual check-out time
     */
    recordCheckOut(id: string): Promise<void>;
}
