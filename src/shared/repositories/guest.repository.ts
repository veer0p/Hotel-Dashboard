// Supabase Guest Repository Implementation

import { SupabaseClient } from '@supabase/supabase-js';
import { IGuestRepository } from '../interfaces/guest.repository.interface';
import {
    Guest,
    GuestPropertyLink,
    CreateGuestDTO,
    UpdateGuestDTO,
    GuestFilters
} from '../types/guest.types';

export class GuestRepository implements IGuestRepository {
    constructor(private supabase: SupabaseClient) { }

    async create(data: CreateGuestDTO): Promise<Guest> {
        const { data: guest, error } = await this.supabase
            .from('guests')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(`Failed to create guest: ${error.message}`);
        return guest;
    }

    async findById(id: string): Promise<Guest | null> {
        const { data, error } = await this.supabase
            .from('guests')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to find guest: ${error.message}`);
        }
        return data;
    }

    async findByEmail(email: string): Promise<Guest | null> {
        const { data, error } = await this.supabase
            .from('guests')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to find guest by email: ${error.message}`);
        }
        return data;
    }

    async search(filters: GuestFilters, limit: number = 50): Promise<Guest[]> {
        let query = this.supabase
            .from('guests')
            .select('*');

        if (filters.search) {
            const searchTerm = `%${filters.search}%`;
            query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`);
        }

        if (filters.loyalty_tier) {
            query = query.eq('loyalty_tier', filters.loyalty_tier);
        }

        const { data, error } = await query
            .limit(limit)
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to search guests: ${error.message}`);
        return data || [];
    }

    async update(id: string, data: UpdateGuestDTO): Promise<Guest> {
        const { data: guest, error } = await this.supabase
            .from('guests')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Failed to update guest: ${error.message}`);
        return guest;
    }

    async getPropertyLink(guestId: string, propertyId: string): Promise<GuestPropertyLink | null> {
        const { data, error } = await this.supabase
            .from('guest_property_links')
            .select('*')
            .eq('guest_id', guestId)
            .eq('property_id', propertyId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to get property link: ${error.message}`);
        }
        return data;
    }

    async upsertPropertyLink(
        guestId: string,
        propertyId: string,
        data: Partial<GuestPropertyLink>
    ): Promise<GuestPropertyLink> {
        const { data: link, error } = await this.supabase
            .from('guest_property_links')
            .upsert({
                guest_id: guestId,
                property_id: propertyId,
                ...data,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'guest_id,property_id',
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to upsert property link: ${error.message}`);
        return link;
    }

    async findByReservation(reservationId: string): Promise<Guest[]> {
        const { data, error } = await this.supabase
            .from('reservation_guests')
            .select('guest:guests(*)')
            .eq('reservation_id', reservationId);

        if (error) throw new Error(`Failed to find reservation guests: ${error.message}`);
        return (data || []).map((row: any) => row.guest);
    }
}
