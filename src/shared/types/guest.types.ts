// Guest Types - Auto-generated from DB schema

export type LoyaltyTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface Guest {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    country_code: string | null;
    date_of_birth: string | null;
    loyalty_number: string | null;
    loyalty_tier: LoyaltyTier;
    total_points: number;
    marketing_consent: boolean;
    data_sharing_consent: boolean;
    data_retention_until: string | null;
    anonymized: boolean;
    created_at: string;
    updated_at: string;
}

export interface GuestPropertyLink {
    id: string;
    guest_id: string;
    property_id: string;
    local_guest_id: string | null;
    preferences: Record<string, unknown>;
    notes: string | null;
    vip_status: boolean;
    blacklist_reason: string | null;
    last_stay_date: string | null;
    total_stays: number;
    lifetime_value: number;
    created_at: string;
    updated_at: string;
}

export interface CreateGuestDTO {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    country_code?: string;
    date_of_birth?: string;
}

export interface UpdateGuestDTO {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    country_code?: string;
    date_of_birth?: string;
    marketing_consent?: boolean;
}

export interface GuestFilters {
    search?: string;
    vip_only?: boolean;
    loyalty_tier?: LoyaltyTier;
}
