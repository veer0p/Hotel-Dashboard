// Room Types - Auto-generated from DB schema

export type RoomStatus = 'vacant' | 'occupied' | 'dirty' | 'maintenance' | 'out_of_order';

export interface Room {
    id: string;
    property_id: string;
    room_number: string;
    floor_id: string | null;
    room_type_id: string;
    status: RoomStatus;
    current_reservation_id: string | null;
    features: Record<string, unknown>;
    last_cleaned: string | null;
    next_maintenance: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface RoomType {
    id: string;
    property_id: string;
    name: string;
    code: string;
    description: string | null;
    base_price: number;
    max_occupancy: number;
    default_adults: number;
    default_children: number;
    amenities: string[];
    images: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Floor {
    id: string;
    property_id: string;
    floor_number: number;
    name: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface RoomWithType extends Room {
    room_type: RoomType;
    floor?: Floor;
}

export interface UpdateRoomDTO {
    status?: RoomStatus;
    room_type_id?: string;
    floor_id?: string;
    features?: Record<string, unknown>;
    is_active?: boolean;
}

export interface RoomFilters {
    status?: RoomStatus | RoomStatus[];
    room_type_id?: string;
    floor_id?: string;
    is_active?: boolean;
}

export interface RoomAvailability {
    room_id: string;
    room_number: string;
    room_type: string;
    is_available: boolean;
    current_status: RoomStatus;
}
