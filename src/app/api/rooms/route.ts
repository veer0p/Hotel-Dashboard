// Rooms API Route
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ServiceFactory } from '@/shared/factory/service-factory';
import { RoomFilters } from '@/shared/types';

/**
 * GET /api/rooms
 * Query params: property_id, status, room_type_id, check_availability, check_in, check_out
 */
export async function GET(request: Request) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const propertyId = searchParams.get('property_id');
        if (!propertyId) {
            return NextResponse.json({ error: 'property_id is required' }, { status: 400 });
        }

        const factory = new ServiceFactory(supabase);
        const roomService = factory.getRoomService();

        // Check if availability check is requested
        const checkAvailability = searchParams.get('check_availability') === 'true';
        if (checkAvailability) {
            const checkIn = searchParams.get('check_in');
            const checkOut = searchParams.get('check_out');

            if (!checkIn || !checkOut) {
                return NextResponse.json(
                    { error: 'check_in and check_out are required for availability check' },
                    { status: 400 }
                );
            }

            const availability = await roomService.checkAvailability(propertyId, checkIn, checkOut);
            return NextResponse.json({ data: availability });
        }

        // Regular room listing
        const filters: RoomFilters = {};
        const status = searchParams.get('status');
        if (status) {
            filters.status = status.split(',') as any;
        }
        if (searchParams.get('room_type_id')) {
            filters.room_type_id = searchParams.get('room_type_id')!;
        }

        const rooms = await roomService.getRooms(propertyId, filters);
        return NextResponse.json({ data: rooms });
    } catch (error: any) {
        console.error('GET /api/rooms error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
