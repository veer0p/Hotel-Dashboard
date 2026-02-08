export interface FolioCharge {
    id: string;
    time: string;
    date: string;
    description: string;
    amount: number;
    category: 'room' | 'food' | 'bar' | 'spa' | 'parking' | 'other';
    staff: string;
    notes?: string;
    isNew?: boolean;
}

export interface FolioPayment {
    id: string;
    date: string;
    amount: number;
    method: string;
    last4?: string;
}

export interface FolioData {
    id: string;
    guestId: string;
    guestName: string;
    roomNumber: string;
    reservationId: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    charges: FolioCharge[];
    payments: FolioPayment[];
}

export const mockFolioData: FolioData = {
    id: 'F-4821',
    guestId: 'G001',
    guestName: 'Sarah Chen',
    roomNumber: '202',
    reservationId: 'RES-9901',
    totalAmount: 832,
    paidAmount: 500,
    dueAmount: 332,
    payments: [
        { id: 'p1', date: '2024-12-15', amount: 500, method: 'Visa', last4: '4242' }
    ],
    charges: [
        {
            id: 'c1',
            date: 'DEC 15',
            time: '3:15 PM',
            description: 'Room Charge - King Suite (Night 1)',
            amount: 189,
            category: 'room',
            staff: 'System'
        },
        {
            id: 'c2',
            date: 'DEC 15',
            time: '3:15 PM',
            description: 'Room Charge - King Suite (Night 2)',
            amount: 189,
            category: 'room',
            staff: 'System'
        },
        {
            id: 'c3',
            date: 'DEC 15',
            time: '3:15 PM',
            description: 'Room Charge - King Suite (Night 3)',
            amount: 189,
            category: 'room',
            staff: 'System'
        },
        {
            id: 'c4',
            date: 'DEC 15',
            time: '4:30 PM',
            description: 'Mini-bar: Coca-Cola',
            amount: 4,
            category: 'bar',
            staff: 'Housekeeping'
        },
        {
            id: 'c5',
            date: 'DEC 15',
            time: '4:30 PM',
            description: 'Mini-bar: Water (Premium)',
            amount: 3,
            category: 'bar',
            staff: 'Housekeeping'
        },
        {
            id: 'c6',
            date: 'DEC 15',
            time: '7:45 PM',
            description: 'Room Service: Caesar Salad',
            amount: 18,
            category: 'food',
            staff: 'Chef Mario'
        },
        {
            id: 'c7',
            date: 'DEC 15',
            time: '7:45 PM',
            description: 'Room Service: Wine (Glass)',
            amount: 32,
            category: 'bar',
            staff: 'Chef Mario'
        },
        {
            id: 'c8',
            date: 'DEC 16',
            time: '09:00 AM',
            description: 'Breakfast Buffet',
            amount: 25,
            category: 'food',
            staff: 'Front Desk'
        }
    ]
};
