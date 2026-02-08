// Mock data for housekeeping staff and assignments

export interface HousekeepingStaff {
    id: string;
    name: string;
    avatar?: string;
    assignedRooms: string[]; // Room IDs
    completedToday: number;
    averageTime: number; // minutes per room
    status: 'active' | 'break' | 'offline';
    shift: 'morning' | 'evening' | 'night';
}

export interface CleaningTask {
    id: string;
    label: string;
    estimatedTime: number; // minutes
    priority: 'high' | 'medium' | 'low';
    category: 'bedroom' | 'bathroom' | 'common';
}

export const mockHousekeepingStaff: HousekeepingStaff[] = [
    {
        id: 'staff-1',
        name: 'Maria Garcia',
        assignedRooms: ['room-201', 'room-202', 'room-205'],
        completedToday: 8,
        averageTime: 25,
        status: 'active',
        shift: 'morning',
    },
    {
        id: 'staff-2',
        name: 'John Smith',
        assignedRooms: ['room-203', 'room-204'],
        completedToday: 6,
        averageTime: 28,
        status: 'active',
        shift: 'morning',
    },
    {
        id: 'staff-3',
        name: 'Lisa Chen',
        assignedRooms: ['room-301', 'room-302'],
        completedToday: 7,
        averageTime: 23,
        status: 'break',
        shift: 'morning',
    },
    {
        id: 'staff-4',
        name: 'Ahmed Hassan',
        assignedRooms: [],
        completedToday: 5,
        averageTime: 26,
        status: 'active',
        shift: 'morning',
    },
];

export const standardCleaningTasks: CleaningTask[] = [
    // Bedroom
    { id: 'task-1', label: 'Make bed with fresh linens', estimatedTime: 5, priority: 'high', category: 'bedroom' },
    { id: 'task-2', label: 'Dust all surfaces', estimatedTime: 3, priority: 'medium', category: 'bedroom' },
    { id: 'task-3', label: 'Vacuum carpet/mop floor', estimatedTime: 5, priority: 'high', category: 'bedroom' },
    { id: 'task-4', label: 'Empty trash bins', estimatedTime: 2, priority: 'high', category: 'bedroom' },
    { id: 'task-5', label: 'Restock amenities', estimatedTime: 3, priority: 'medium', category: 'bedroom' },

    // Bathroom
    { id: 'task-6', label: 'Clean toilet and sink', estimatedTime: 5, priority: 'high', category: 'bathroom' },
    { id: 'task-7', label: 'Clean shower/bathtub', estimatedTime: 5, priority: 'high', category: 'bathroom' },
    { id: 'task-8', label: 'Replace towels', estimatedTime: 2, priority: 'high', category: 'bathroom' },
    { id: 'task-9', label: 'Restock toiletries', estimatedTime: 2, priority: 'medium', category: 'bathroom' },
    { id: 'task-10', label: 'Clean mirrors', estimatedTime: 2, priority: 'medium', category: 'bathroom' },

    // Common
    { id: 'task-11', label: 'Check mini-bar inventory', estimatedTime: 3, priority: 'low', category: 'common' },
    { id: 'task-12', label: 'Inspect room for damages', estimatedTime: 2, priority: 'medium', category: 'common' },
    { id: 'task-13', label: 'Set thermostat to default', estimatedTime: 1, priority: 'low', category: 'common' },
];

export const suiteCleaningTasks: CleaningTask[] = [
    ...standardCleaningTasks,
    { id: 'task-14', label: 'Clean living area', estimatedTime: 5, priority: 'high', category: 'common' },
    { id: 'task-15', label: 'Organize kitchenette', estimatedTime: 4, priority: 'medium', category: 'common' },
    { id: 'task-16', label: 'Polish furniture', estimatedTime: 5, priority: 'low', category: 'bedroom' },
];

export const getCleaningTasksForRoomType = (roomType: string): CleaningTask[] => {
    return roomType === 'suite' ? suiteCleaningTasks : standardCleaningTasks;
};
