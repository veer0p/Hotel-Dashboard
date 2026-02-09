// Check-in API Route
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ServiceFactory } from '@/shared/factory/service-factory';

/**
 * POST /api/reservations/[id]/check-in
 * Checks in a guest for the given reservation
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const supabase = createServerClient();
        const factory = new ServiceFactory(supabase);
        const reservationService = factory.getReservationService();

        const result = await reservationService.checkIn(id);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error(`POST /api/reservations/${id}/check-in error:`, error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
