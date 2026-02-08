export interface GuestEvent {
    id: string;
    date: string;
    type: 'stay' | 'comm' | 'review' | 'milestone';
    title: string;
    description: string;
    room?: string;
    amount?: number;
    rating?: number;
    icon?: string;
}

export interface GuestPreference {
    id: string;
    category: 'Room' | 'Amenity' | 'Service';
    icon: string;
    label: string;
    priority: 'high' | 'normal';
}

export interface Guest {
    id: string;
    name: string;
    status: 'VIP' | 'Regular' | 'Loyal';
    email: string;
    phone: string;
    address: string;
    avatar: string;
    staysCount: number;
    avgSpend: number;
    lifetimeValue: number;
    paymentMethods: { type: 'Visa' | 'Mastercard'; last4: string }[];
    timeline: GuestEvent[];
    preferences: GuestPreference[];
    tags: string[];
    notes: string;
    currentContext: {
        status: string;
        nextMilestone: string;
        description: string;
        suggestions: string[];
    };
}

export const mockGuests: Guest[] = [
    {
        id: 'G001',
        name: 'Sarah Chen',
        status: 'VIP',
        email: 'sarah.chen@example.com',
        phone: '+1 (555) 012-3456',
        address: '123 Tech Lane, San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        staysCount: 12,
        avgSpend: 315,
        lifetimeValue: 8420,
        paymentMethods: [
            { type: 'Visa', last4: '4242' },
            { type: 'Mastercard', last4: '8888' }
        ],
        tags: ['VIP', 'Loyal', 'Business', 'Tech'],
        notes: 'Prefers quiet floor, high floor, no flowers due to allergies.',
        preferences: [
            { id: 'p1', category: 'Room', icon: 'VolumeX', label: 'Quiet Room', priority: 'high' },
            { id: 'p2', category: 'Room', icon: 'Building2', label: 'High Floor', priority: 'normal' },
            { id: 'p3', category: 'Amenity', icon: 'Wifi', label: 'High-speed WiFi', priority: 'high' },
            { id: 'p4', category: 'Service', icon: 'Coffee', label: 'Morning Espresso', priority: 'normal' }
        ],
        currentContext: {
            status: 'Arriving Today',
            nextMilestone: 'Anniversary next month',
            description: 'Arriving at 3:00 PM today for a 3-night stay in Room 202.',
            suggestions: [
                'Send pre-arrival champagne offer',
                'Upgrade to honeymoon suite if available',
                'Schedule spa couple\'s treatment'
            ]
        },
        timeline: [
            {
                id: 'e1',
                date: '2024-12-15',
                type: 'stay',
                title: 'Check-in: Room 202',
                description: '3 nights • $567 total',
                room: '202',
                amount: 567
            },
            {
                id: 'e2',
                date: '2024-12-18',
                type: 'review',
                title: 'Review: 5 Stars',
                description: '"Amazing stay! The staff remembered my morning espresso preference."',
                rating: 5
            },
            {
                id: 'e3',
                date: '2024-10-20',
                type: 'stay',
                title: 'Check-in: Room 101',
                description: '2 nights • $378 total',
                room: '101',
                amount: 378
            },
            {
                id: 'e4',
                date: '2024-08-05',
                type: 'stay',
                title: 'Anniversary Stay: Suite 301',
                description: '2 nights • $892 total • Champagne sent to room',
                room: '301',
                amount: 892
            },
            {
                id: 'e5',
                date: '2024-05-30',
                type: 'milestone',
                title: 'First Stay',
                description: 'Welcome note and amenity pack sent.'
            }
        ]
    }
];
