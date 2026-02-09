// Reservations API Route - List and Create
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ServiceFactory } from '@/shared/factory/service-factory';
import { CreateReservationDTO, ReservationFilters } from '@/shared/types';

/**
 * GET /api/reservations
 * Query params: property_id, status, check_in_date_from, check_in_date_to
 */
export async function GET(request: Request) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const propertyId = searchParams.get('property_id');
        if (!propertyId) {
            return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
        }

        const filters: ReservationFilters = {};
        const status = searchParams.get('status');
        if (status) {
            filters.status = status.split(',') as any;
        }
        if (searchParams.get('check_in_date_from')) {
            filters.check_in_date_from = searchParams.get('check_in_date_from')!;
        }
        if (searchParams.get('check_in_date_to')) {
            filters.check_in_date_to = searchParams.get('check_in_date_to')!;
        }

        const factory = new ServiceFactory(supabase);
        const reservationService = factory.getReservationService();
        const reservations = await reservationService.getReservations(propertyId, filters);

        return NextResponse.json({ data: reservations });
    } catch (error: any) {
        console.error('GET /api/reservations error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/reservations
 * Body: CreateReservationDTO
 */
export async function POST(request: Request) {
    try {
        const supabase = createServerClient();
        const body: CreateReservationDTO = await request.json();

        if (!body.property_id || !body.organization_id) {
            return NextResponse.json(
                { error: 'property_id and organization_id are required' },
                { status: 400 }
            );
        }

        if (!body.check_in_date || !body.check_out_date) {
            return NextResponse.json(
                { error: 'check_in_date and check_out_date are required' },
                { status: 400 }
            );
        }

        const factory = new ServiceFactory(supabase);
        const reservationService = factory.getReservationService();
        const reservation = await reservationService.createReservation(body);

        return NextResponse.json({ data: reservation }, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/reservations error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
