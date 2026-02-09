// Reservation Types - Auto-generated from DB schema

export type ReservationStatus =
    | 'tentative'
    | 'confirmed'
    | 'checked_in'
    | 'checked_out'
    | 'cancelled'
    | 'no_show';

export type ReservationSource = 'direct' | 'ota' | 'corporate' | 'agent';

export interface Reservation {
    id: string;
    property_id: string;
    organization_id: string;
    reservation_number: string;
    source: ReservationSource;
    channel: string | null;
    status: ReservationStatus;
    room_id: string | null;
    rate_plan_id: string | null;
    check_in_date: string;
    check_out_date: string;
    actual_check_in: string | null;
    actual_check_out: string | null;
    number_of_guests: number;
    number_of_rooms: number;
    adult_count: number;
    child_count: number;
    special_requests: string | null;
    market_segment: string | null;
    total_amount: number;
    balance_due: number;
    deposit_paid: number;
    cancellation_policy: Record<string, unknown>;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateReservationDTO {
    property_id: string;
    organization_id: string;
    room_id?: string;
    rate_plan_id?: string;
    check_in_date: string;
    check_out_date: string;
    adult_count?: number;
    child_count?: number;
    special_requests?: string;
    total_amount?: number;
    source?: ReservationSource;
    channel?: string;
}

export interface UpdateReservationDTO {
    room_id?: string;
    rate_plan_id?: string;
    check_in_date?: string;
    check_out_date?: string;
    adult_count?: number;
    child_count?: number;
    special_requests?: string;
    total_amount?: number;
    balance_due?: number;
    deposit_paid?: number;
}

export interface ReservationFilters {
    status?: ReservationStatus | ReservationStatus[];
    check_in_date_from?: string;
    check_in_date_to?: string;
    check_out_date_from?: string;
    check_out_date_to?: string;
    room_id?: string;
}
