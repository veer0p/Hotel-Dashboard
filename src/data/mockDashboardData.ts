export interface MetricData {
    label: string;
    value: string;
    trend: number; // percentage change
    trendDirection: 'up' | 'down' | 'neutral';
}

export interface RoomStatus {
    roomNumber: string;
    status: 'vacant' | 'occupied' | 'dirty' | 'maintenance';
    guestName?: string;
    notes?: string;
}

export interface ScheduleItem {
    time: string;
    guest: string;
    room: string;
    action: 'check-in' | 'check-out' | 'maintenance' | 'prepare';
    actionLabel: string;
}

export const mockMetrics: MetricData[] = [
    {
        label: "Occupancy",
        value: "85%",
        trend: 2,
        trendDirection: 'up'
    },
    {
        label: "Revenue",
        value: "$5,240",
        trend: -5,
        trendDirection: 'down'
    },
    {
        label: "Arrivals",
        value: "12",
        trend: 0,
        trendDirection: 'neutral'
    },
    {
        label: "Checkouts",
        value: "8",
        trend: 0,
        trendDirection: 'neutral'
    }
];

export const mockRooms: RoomStatus[] = [
    { roomNumber: '101', status: 'vacant' },
    { roomNumber: '102', status: 'occupied', guestName: 'S.C' },
    { roomNumber: '103', status: 'vacant' },
    { roomNumber: '104', status: 'dirty' },
    { roomNumber: '105', status: 'vacant' },
    { roomNumber: '106', status: 'maintenance' },
    { roomNumber: '107', status: 'occupied', guestName: 'A.P' },
    { roomNumber: '108', status: 'dirty' },
    { roomNumber: '201', status: 'occupied', guestName: 'J.D' },
    { roomNumber: '202', status: 'vacant' },
    { roomNumber: '203', status: 'occupied', guestName: 'M.K' },
    { roomNumber: '204', status: 'dirty' },
    { roomNumber: '205', status: 'vacant' },
    { roomNumber: '206', status: 'occupied', guestName: 'R.S' },
    { roomNumber: '207', status: 'vacant' },
    { roomNumber: '208', status: 'maintenance' },
];

export const mockSchedule: ScheduleItem[] = [
    {
        time: '3:00 PM',
        guest: 'Sarah Chen',
        room: '102',
        action: 'check-in',
        actionLabel: 'Check-in'
    },
    {
        time: '3:30 PM',
        guest: 'Alex Patel',
        room: '201',
        action: 'maintenance',
        actionLabel: 'Maintenance'
    },
    {
        time: '4:00 PM',
        guest: 'Group (4)',
        room: '103-104',
        action: 'prepare',
        actionLabel: 'Prepare'
    },
    {
        time: '4:30 PM',
        guest: 'Michael Kumar',
        room: '205',
        action: 'check-in',
        actionLabel: 'Check-in'
    },
    {
        time: '5:00 PM',
        guest: 'Rachel Smith',
        room: '108',
        action: 'check-out',
        actionLabel: 'Check-out'
    },
    {
        time: '5:30 PM',
        guest: 'David Lee',
        room: '206',
        action: 'check-in',
        actionLabel: 'Check-in'
    },
    {
        time: '6:00 PM',
        guest: 'Emma Wilson',
        room: '301',
        action: 'check-in',
        actionLabel: 'Check-in'
    },
];
