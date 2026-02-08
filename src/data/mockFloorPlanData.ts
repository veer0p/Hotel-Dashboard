// Mock data for floor plan visualization

export type RoomStatus = 'vacant' | 'occupied' | 'dirty' | 'maintenance';
export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential';

export interface RoomPosition {
    x: number;
    y: number;
    width?: number;
    height?: number;
}

export interface Room {
    id: string;
    number: string;
    floor: number;
    type: RoomType;
    status: RoomStatus;
    position: RoomPosition;
    connections?: string[]; // IDs of connecting rooms
    currentGuest?: {
        name: string;
        initials: string;
        checkIn: string;
        checkOut: string;
    };
    assignedStaff?: string;
    lastCleaned?: string;
    revenue?: number;
    rate?: number;
    features?: string[];
}

export interface FloorLayout {
    floor: number;
    name: string;
    totalRooms: number;
    corridors: CorridorElement[];
    facilities: FacilityElement[];
}

export interface CorridorElement {
    type: 'corridor' | 'stairs' | 'elevator';
    position: RoomPosition;
}

export interface FacilityElement {
    type: 'ice-machine' | 'vending' | 'laundry' | 'emergency-exit';
    position: RoomPosition;
    label: string;
}

// Generate rooms for a floor
const generateFloorRooms = (floor: number, startRoom: number, count: number): Room[] => {
    const rooms: Room[] = [];
    const statuses: RoomStatus[] = ['vacant', 'occupied', 'dirty', 'maintenance'];
    const types: RoomType[] = ['standard', 'deluxe', 'suite'];
    const guests = [
        { name: 'Sarah Chen', initials: 'SC' },
        { name: 'Alex Patel', initials: 'AP' },
        { name: 'John Doe', initials: 'JD' },
        { name: 'Michael Kumar', initials: 'MK' },
        { name: 'Rachel Smith', initials: 'RS' },
        { name: 'David Lee', initials: 'DL' },
        { name: 'Emma Wilson', initials: 'EW' },
        { name: 'James Brown', initials: 'JB' },
    ];

    for (let i = 0; i < count; i++) {
        const roomNum = startRoom + i;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const type = i % 8 === 7 ? 'suite' : i % 4 === 3 ? 'deluxe' : 'standard';

        // Position rooms in a grid (4 rooms per row for left side, 4 for right side)
        const side = i < count / 2 ? 'left' : 'right';
        const rowIndex = side === 'left' ? i : i - count / 2;
        const col = rowIndex % 4;
        const row = Math.floor(rowIndex / 4);

        const x = side === 'left' ? col * 100 : 500 + col * 100;
        const y = row * 100;

        const room: Room = {
            id: `room-${roomNum}`,
            number: `${roomNum}`,
            floor,
            type,
            status,
            position: { x, y, width: 90, height: 90 },
            rate: type === 'suite' ? 299 : type === 'deluxe' ? 189 : 129,
        };

        // Add guest if occupied
        if (status === 'occupied' && Math.random() > 0.3) {
            const guest = guests[Math.floor(Math.random() * guests.length)];
            room.currentGuest = {
                name: guest.name,
                initials: guest.initials,
                checkIn: '2026-02-06',
                checkOut: '2026-02-10',
            };
            if (room.rate) {
                room.revenue = room.rate * 4; // 4 nights
            }
        }

        // Add last cleaned time for dirty rooms
        if (status === 'dirty') {
            room.lastCleaned = '2026-02-08T09:00:00';
        }

        // Add connecting rooms for suites
        if (type === 'suite' && i < count - 1) {
            room.connections = [`room-${roomNum + 1}`];
        }

        rooms.push(room);
    }

    return rooms;
};

// Mock floor layouts
export const mockFloorLayouts: FloorLayout[] = [
    {
        floor: 1,
        name: 'Ground Floor',
        totalRooms: 16,
        corridors: [
            { type: 'corridor', position: { x: 400, y: 0, width: 100, height: 400 } },
            { type: 'elevator', position: { x: 420, y: 150, width: 60, height: 60 } },
            { type: 'stairs', position: { x: 420, y: 250, width: 60, height: 60 } },
        ],
        facilities: [
            { type: 'ice-machine', position: { x: 430, y: 50, width: 40, height: 40 }, label: 'Ice' },
            { type: 'emergency-exit', position: { x: 430, y: 350, width: 40, height: 40 }, label: 'Exit' },
        ],
    },
    {
        floor: 2,
        name: '2nd Floor',
        totalRooms: 16,
        corridors: [
            { type: 'corridor', position: { x: 400, y: 0, width: 100, height: 400 } },
            { type: 'elevator', position: { x: 420, y: 150, width: 60, height: 60 } },
            { type: 'stairs', position: { x: 420, y: 250, width: 60, height: 60 } },
        ],
        facilities: [
            { type: 'ice-machine', position: { x: 430, y: 50, width: 40, height: 40 }, label: 'Ice' },
            { type: 'vending', position: { x: 430, y: 100, width: 40, height: 40 }, label: 'Vending' },
        ],
    },
    {
        floor: 3,
        name: '3rd Floor',
        totalRooms: 16,
        corridors: [
            { type: 'corridor', position: { x: 400, y: 0, width: 100, height: 400 } },
            { type: 'elevator', position: { x: 420, y: 150, width: 60, height: 60 } },
            { type: 'stairs', position: { x: 420, y: 250, width: 60, height: 60 } },
        ],
        facilities: [
            { type: 'ice-machine', position: { x: 430, y: 50, width: 40, height: 40 }, label: 'Ice' },
            { type: 'laundry', position: { x: 430, y: 300, width: 40, height: 40 }, label: 'Laundry' },
        ],
    },
];

// Generate all rooms
export const mockRoomsData: Room[] = [
    ...generateFloorRooms(1, 101, 16),
    ...generateFloorRooms(2, 201, 16),
    ...generateFloorRooms(3, 301, 16),
];

// Room statistics
export const getRoomStats = (rooms: Room[]) => {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const vacant = rooms.filter(r => r.status === 'vacant').length;
    const dirty = rooms.filter(r => r.status === 'dirty').length;
    const maintenance = rooms.filter(r => r.status === 'maintenance').length;

    return {
        total,
        occupied,
        vacant,
        dirty,
        maintenance,
        occupancyRate: ((occupied / total) * 100).toFixed(1),
    };
};
