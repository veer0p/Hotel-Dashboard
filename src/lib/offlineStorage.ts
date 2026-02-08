"use client";

// Offline data management utilities

interface CachedData {
    data: any;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const offlineStorage = {
    // Save data to localStorage
    saveData: (key: string, data: any) => {
        try {
            const cachedData: CachedData = {
                data,
                timestamp: Date.now(),
            };
            localStorage.setItem(key, JSON.stringify(cachedData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    // Get data from localStorage
    getData: (key: string): any | null => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const cachedData: CachedData = JSON.parse(item);
            const now = Date.now();

            // Check if cache is still valid
            if (now - cachedData.timestamp > CACHE_DURATION) {
                localStorage.removeItem(key);
                return null;
            }

            return cachedData.data;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Clear specific cache
    clearData: (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },

    // Clear all cache
    clearAll: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing all localStorage:', error);
        }
    },
};

// Offline action queue
interface QueuedAction {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
}

export const actionQueue = {
    // Add action to queue
    enqueue: (type: string, payload: any) => {
        try {
            const queue = actionQueue.getQueue();
            const action: QueuedAction = {
                id: `${Date.now()}-${Math.random()}`,
                type,
                payload,
                timestamp: Date.now(),
            };
            queue.push(action);
            localStorage.setItem('offline_queue', JSON.stringify(queue));
        } catch (error) {
            console.error('Error enqueuing action:', error);
        }
    },

    // Get all queued actions
    getQueue: (): QueuedAction[] => {
        try {
            const queue = localStorage.getItem('offline_queue');
            return queue ? JSON.parse(queue) : [];
        } catch (error) {
            console.error('Error getting queue:', error);
            return [];
        }
    },

    // Remove action from queue
    dequeue: (id: string) => {
        try {
            const queue = actionQueue.getQueue();
            const filtered = queue.filter(action => action.id !== id);
            localStorage.setItem('offline_queue', JSON.stringify(filtered));
        } catch (error) {
            console.error('Error dequeuing action:', error);
        }
    },

    // Clear all queued actions
    clearQueue: () => {
        try {
            localStorage.removeItem('offline_queue');
        } catch (error) {
            console.error('Error clearing queue:', error);
        }
    },

    // Process queue when back online
    processQueue: async (callback: (action: QueuedAction) => Promise<void>) => {
        const queue = actionQueue.getQueue();
        for (const action of queue) {
            try {
                await callback(action);
                actionQueue.dequeue(action.id);
            } catch (error) {
                console.error('Error processing queued action:', error);
            }
        }
    },
};
