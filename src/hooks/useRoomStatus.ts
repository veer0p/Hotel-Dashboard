// Hook for managing room status changes with animations and history

import { useState, useCallback } from 'react';
import { Room, RoomStatus } from '@/data/mockFloorPlanData';

interface StatusChange {
    roomId: string;
    oldStatus: RoomStatus;
    newStatus: RoomStatus;
    timestamp: Date;
    user: string;
}

export const useRoomStatus = (initialRooms: Room[]) => {
    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const [statusHistory, setStatusHistory] = useState<StatusChange[]>([]);
    const [animatingRooms, setAnimatingRooms] = useState<Set<string>>(new Set());

    const changeRoomStatus = useCallback((roomId: string, newStatus: RoomStatus) => {
        // Add animation
        setAnimatingRooms(prev => new Set(prev).add(roomId));

        // Update room status
        setRooms(prevRooms => {
            const updatedRooms = prevRooms.map(room => {
                if (room.id === roomId) {
                    // Record status change
                    const change: StatusChange = {
                        roomId,
                        oldStatus: room.status,
                        newStatus,
                        timestamp: new Date(),
                        user: 'Current User', // TODO: Get from auth
                    };
                    setStatusHistory(prev => [change, ...prev]);

                    return { ...room, status: newStatus };
                }
                return room;
            });
            return updatedRooms;
        });

        // Remove animation after delay
        setTimeout(() => {
            setAnimatingRooms(prev => {
                const next = new Set(prev);
                next.delete(roomId);
                return next;
            });
        }, 300);
    }, []);

    const bulkChangeStatus = useCallback((roomIds: string[], newStatus: RoomStatus) => {
        roomIds.forEach(roomId => changeRoomStatus(roomId, newStatus));
    }, [changeRoomStatus]);

    const getStatusHistory = useCallback((roomId?: string) => {
        if (roomId) {
            return statusHistory.filter(change => change.roomId === roomId);
        }
        return statusHistory;
    }, [statusHistory]);

    return {
        rooms,
        changeRoomStatus,
        bulkChangeStatus,
        getStatusHistory,
        animatingRooms,
    };
};
