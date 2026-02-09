// Guest Repository Interface

import {
    Guest,
    GuestPropertyLink,
    CreateGuestDTO,
    UpdateGuestDTO,
    GuestFilters
} from '../types/guest.types';

export interface IGuestRepository {
    /**
     * Create a new guest
     */
    create(data: CreateGuestDTO): Promise<Guest>;

    /**
     * Find guest by ID
     */
    findById(id: string): Promise<Guest | null>;

    /**
     * Find guest by email
     */
    findByEmail(email: string): Promise<Guest | null>;

    /**
     * Search guests with filters
     */
    search(filters: GuestFilters, limit?: number): Promise<Guest[]>;

    /**
     * Update guest
     */
    update(id: string, data: UpdateGuestDTO): Promise<Guest>;

    /**
     * Get guest's property-specific data
     */
    getPropertyLink(guestId: string, propertyId: string): Promise<GuestPropertyLink | null>;

    /**
     * Create or update property link
     */
    upsertPropertyLink(guestId: string, propertyId: string, data: Partial<GuestPropertyLink>): Promise<GuestPropertyLink>;

    /**
     * Get guests for a reservation
     */
    findByReservation(reservationId: string): Promise<Guest[]>;
}
