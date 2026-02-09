// Guests API Route
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { ServiceFactory } from '@/shared/factory/service-factory';
import { CreateGuestDTO, GuestFilters } from '@/shared/types';

/**
 * GET /api/guests
 * Query params: search, vip_only, loyalty_tier, limit
 */
export async function GET(request: Request) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);

        const filters: GuestFilters = {};
        if (searchParams.get('search')) {
            filters.search = searchParams.get('search')!;
        }
        if (searchParams.get('vip_only') === 'true') {
            filters.vip_only = true;
        }
        if (searchParams.get('loyalty_tier')) {
            filters.loyalty_tier = searchParams.get('loyalty_tier') as any;
        }

        const limit = parseInt(searchParams.get('limit') || '50');

        const factory = new ServiceFactory(supabase);
        const guestService = factory.getGuestService();
        const guests = await guestService.searchGuests(filters, limit);

        return NextResponse.json({ data: guests });
    } catch (error: any) {
        console.error('GET /api/guests error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * POST /api/guests
 * Body: CreateGuestDTO
 */
export async function POST(request: Request) {
    try {
        const supabase = createServerClient();
        const body: CreateGuestDTO = await request.json();

        if (!body.first_name || !body.last_name) {
            return NextResponse.json(
                { error: 'first_name and last_name are required' },
                { status: 400 }
            );
        }

        const factory = new ServiceFactory(supabase);
        const guestService = factory.getGuestService();
        const guest = await guestService.createGuest(body);

        return NextResponse.json({ data: guest }, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/guests error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
