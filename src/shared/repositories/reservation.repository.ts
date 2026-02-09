// Supabase Reservation Repository Implementation

import { SupabaseClient } from '@supabase/supabase-js';
import { IReservationRepository } from '../interfaces/reservation.repository.interface';
import {
    Reservation,
    CreateReservationDTO,
    UpdateReservationDTO,
    ReservationFilters,
    ReservationStatus
} from '../types/reservation.types';

export class ReservationRepository implements IReservationRepository {
    constructor(private supabase: SupabaseClient) { }

    async create(data: CreateReservationDTO): Promise<Reservation> {
        const reservationNumber = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        const { data: reservation, error } = await this.supabase
            .from('reservations')
            .insert({
                ...data,
                reservation_number: reservationNumber,
                status: 'confirmed',
                balance_due: data.total_amount || 0,
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create reservation: ${error.message}`);
        return reservation;
    }

    async findById(id: string): Promise<Reservation | null> {
        const { data, error } = await this.supabase
            .from('reservations')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to find reservation: ${error.message}`);
        }
        return data;
    }

    async findByProperty(propertyId: string, filters?: ReservationFilters): Promise<Reservation[]> {
        let query = this.supabase
            .from('reservations')
            .select('*')
            .eq('property_id', propertyId);

        if (filters?.status) {
            if (Array.isArray(filters.status)) {
                query = query.in('status', filters.status);
            } else {
                query = query.eq('status', filters.status);
            }
        }

        if (filters?.check_in_date_from) {
            query = query.gte('check_in_date', filters.check_in_date_from);
        }

        if (filters?.check_in_date_to) {
            query = query.lte('check_in_date', filters.check_in_date_to);
        }

        if (filters?.room_id) {
            query = query.eq('room_id', filters.room_id);
        }

        const { data, error } = await query.order('check_in_date', { ascending: true });

        if (error) throw new Error(`Failed to fetch reservations: ${error.message}`);
        return data || [];
    }

    async findTodayArrivals(propertyId: string): Promise<Reservation[]> {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('reservations')
            .select('*')
            .eq('property_id', propertyId)
            .eq('check_in_date', today)
            .in('status', ['confirmed', 'tentative'])
            .order('created_at', { ascending: true });

        if (error) throw new Error(`Failed to fetch arrivals: ${error.message}`);
        return data || [];
    }

    async findTodayDepartures(propertyId: string): Promise<Reservation[]> {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('reservations')
            .select('*')
            .eq('property_id', propertyId)
            .eq('check_out_date', today)
            .eq('status', 'checked_in')
            .order('created_at', { ascending: true });

        if (error) throw new Error(`Failed to fetch departures: ${error.message}`);
        return data || [];
    }

    async updateStatus(id: string, status: ReservationStatus): Promise<void> {
        const { error } = await this.supabase
            .from('reservations')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw new Error(`Failed to update status: ${error.message}`);
    }

    async update(id: string, data: UpdateReservationDTO): Promise<Reservation> {
        const { data: reservation, error } = await this.supabase
            .from('reservations')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(`Failed to update reservation: ${error.message}`);
        return reservation;
    }

    async recordCheckIn(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('reservations')
            .update({
                status: 'checked_in',
                actual_check_in: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw new Error(`Failed to record check-in: ${error.message}`);
    }

    async recordCheckOut(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('reservations')
            .update({
                status: 'checked_out',
                actual_check_out: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw new Error(`Failed to record check-out: ${error.message}`);
    }
}
