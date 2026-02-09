// Guest Service - Pure Business Logic

import { IGuestRepository } from '../interfaces/guest.repository.interface';
import {
    Guest,
    GuestPropertyLink,
    CreateGuestDTO,
    UpdateGuestDTO,
    GuestFilters
} from '../types/guest.types';

export class GuestService {
    constructor(private guestRepo: IGuestRepository) { }

    /**
     * Create a new guest
     */
    async createGuest(data: CreateGuestDTO): Promise<Guest> {
        // Business rule: Check for duplicate email
        if (data.email) {
            const existing = await this.guestRepo.findByEmail(data.email);
            if (existing) {
                throw new Error('A guest with this email already exists');
            }
        }

        return this.guestRepo.create(data);
    }

    /**
     * Get or create guest by email
     */
    async getOrCreateByEmail(email: string, data: CreateGuestDTO): Promise<Guest> {
        const existing = await this.guestRepo.findByEmail(email);
        if (existing) {
            return existing;
        }
        return this.guestRepo.create({ ...data, email });
    }

    /**
     * Get guest by ID
     */
    async getGuest(id: string): Promise<Guest | null> {
        return this.guestRepo.findById(id);
    }

    /**
     * Search guests
     */
    async searchGuests(filters: GuestFilters, limit?: number): Promise<Guest[]> {
        return this.guestRepo.search(filters, limit);
    }

    /**
     * Update guest
     */
    async updateGuest(id: string, data: UpdateGuestDTO): Promise<Guest> {
        const guest = await this.guestRepo.findById(id);
        if (!guest) {
            throw new Error('Guest not found');
        }

        // Business rule: Check email uniqueness if changing
        if (data.email && data.email !== guest.email) {
            const existing = await this.guestRepo.findByEmail(data.email);
            if (existing) {
                throw new Error('A guest with this email already exists');
            }
        }

        return this.guestRepo.update(id, data);
    }

    /**
     * Get guest's property-specific data
     */
    async getGuestPropertyData(guestId: string, propertyId: string): Promise<GuestPropertyLink | null> {
        return this.guestRepo.getPropertyLink(guestId, propertyId);
    }

    /**
     * Mark guest as VIP for a property
     */
    async markAsVIP(guestId: string, propertyId: string): Promise<GuestPropertyLink> {
        return this.guestRepo.upsertPropertyLink(guestId, propertyId, { vip_status: true });
    }

    /**
     * Remove VIP status
     */
    async removeVIPStatus(guestId: string, propertyId: string): Promise<GuestPropertyLink> {
        return this.guestRepo.upsertPropertyLink(guestId, propertyId, { vip_status: false });
    }

    /**
     * Update guest preferences for a property
     */
    async updatePreferences(
        guestId: string,
        propertyId: string,
        preferences: Record<string, unknown>
    ): Promise<GuestPropertyLink> {
        const link = await this.guestRepo.getPropertyLink(guestId, propertyId);
        const existingPrefs = link?.preferences || {};

        return this.guestRepo.upsertPropertyLink(guestId, propertyId, {
            preferences: { ...existingPrefs, ...preferences },
        });
    }

    /**
     * Get guests for a reservation
     */
    async getReservationGuests(reservationId: string): Promise<Guest[]> {
        return this.guestRepo.findByReservation(reservationId);
    }
}
