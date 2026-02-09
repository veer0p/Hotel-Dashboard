// Single Reservation API Route
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ServiceFactory } from '@/shared/factory/service-factory';

/**
 * GET /api/reservations/[id]
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const supabase = createServerClient();
        const factory = new ServiceFactory(supabase);
        const reservationService = factory.getReservationService();

        const reservation = await reservationService.getReservation(id);

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }

        return NextResponse.json({ data: reservation });
    } catch (error: any) {
        console.error(`GET /api/reservations/${id} error:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/reservations/[id]
 * Cancels a reservation
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const supabase = createServerClient();
        const factory = new ServiceFactory(supabase);
        const reservationService = factory.getReservationService();

        await reservationService.cancelReservation(id);

        return NextResponse.json({ success: true, message: 'Reservation cancelled' });
    } catch (error: any) {
        console.error(`DELETE /api/reservations/${id} error:`, error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
