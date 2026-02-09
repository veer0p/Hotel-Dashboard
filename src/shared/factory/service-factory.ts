// Service Factory - Dependency Injection Container
// This factory creates services with proper repository implementations
// Currently uses Supabase, but can be extended for other providers

import { SupabaseClient } from '@supabase/supabase-js';

// Repositories
import { ReservationRepository } from '../repositories/reservation.repository';
import { GuestRepository } from '../repositories/guest.repository';
import { RoomRepository } from '../repositories/room.repository';

// Services
import { ReservationService } from '../services/reservation.service';
import { GuestService } from '../services/guest.service';
import { RoomService } from '../services/room.service';

/**
 * ServiceFactory creates services with proper repository implementations.
 * 
 * Usage:
 * ```typescript
 * const factory = new ServiceFactory(supabaseClient);
 * const reservationService = factory.getReservationService();
 * await reservationService.checkIn(reservationId);
 * ```
 * 
 * Migration:
 * When migrating to a different database provider (e.g., Prisma),
 * update this factory to inject different repository implementations
 * based on configuration. The services remain unchanged.
 */
export class ServiceFactory {
    private reservationRepo: ReservationRepository;
    private guestRepo: GuestRepository;
    private roomRepo: RoomRepository;

    constructor(private supabase: SupabaseClient) {
        // Initialize repositories
        this.reservationRepo = new ReservationRepository(supabase);
        this.guestRepo = new GuestRepository(supabase);
        this.roomRepo = new RoomRepository(supabase);
    }

    /**
     * Get Reservation Service
     */
    getReservationService(): ReservationService {
        return new ReservationService(this.reservationRepo, this.roomRepo);
    }

    /**
     * Get Guest Service
     */
    getGuestService(): GuestService {
        return new GuestService(this.guestRepo);
    }

    /**
     * Get Room Service
     */
    getRoomService(): RoomService {
        return new RoomService(this.roomRepo);
    }

    /**
     * Get all services at once (convenience method)
     */
    getAllServices() {
        return {
            reservation: this.getReservationService(),
            guest: this.getGuestService(),
            room: this.getRoomService(),
        };
    }
}

/**
 * Singleton factory instance for client-side use
 * For server-side, create a new factory with the server client
 */
let clientFactory: ServiceFactory | null = null;

export function getClientFactory(supabase: SupabaseClient): ServiceFactory {
    if (!clientFactory) {
        clientFactory = new ServiceFactory(supabase);
    }
    return clientFactory;
}
