"use client";

import { Box, Typography, Chip, List, ListItem, ListItemButton, Collapse } from "@mui/material";
import { useState, MouseEvent, memo } from "react";
import { RoomStatus } from "@/data/mockDashboardData";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MobileRoomListProps {
    rooms: RoomStatus[];
    onRoomClick: (room: RoomStatus) => void;
    onRoomContextMenu: (event: MouseEvent<HTMLDivElement>, room: RoomStatus) => void;
}

const statusColors = {
    vacant: {
        bg: '#10B981',
        text: '#ffffff',
    },
    occupied: {
        bg: '#8B5CF6',
        text: '#ffffff',
    },
    dirty: {
        bg: '#F59E0B',
        text: '#ffffff',
    },
    maintenance: {
        bg: '#EF4444',
        text: '#ffffff',
    },
};

const MobileRoomList = memo(function MobileRoomList({ rooms, onRoomClick, onRoomContextMenu }: MobileRoomListProps) {
    const [filter, setFilter] = useState<'all' | 'vacant' | 'occupied' | 'dirty'>('all');
    const [expandedFloors, setExpandedFloors] = useState<Set<string>>(new Set(['1', '2']));

    // Group rooms by floor
    const roomsByFloor = rooms.reduce((acc, room) => {
        const floor = room.roomNumber.charAt(0);
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(room);
        return acc;
    }, {} as Record<string, RoomStatus[]>);

    const filteredRooms = (floorRooms: RoomStatus[]) => {
        if (filter === 'all') return floorRooms;
        return floorRooms.filter(room => room.status === filter);
    };

    const toggleFloor = (floor: string) => {
        setExpandedFloors(prev => {
            const newSet = new Set(prev);
            if (newSet.has(floor)) {
                newSet.delete(floor);
            } else {
                newSet.add(floor);
            }
            return newSet;
        });
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Box>
            {/* Filter Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 1 }}>
                <Chip
                    label="All"
                    onClick={() => setFilter('all')}
                    color={filter === 'all' ? 'primary' : 'default'}
                    sx={{ fontWeight: 600 }}
                />
                <Chip
                    label="Vacant"
                    onClick={() => setFilter('vacant')}
                    color={filter === 'vacant' ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                />
                <Chip
                    label="Occupied"
                    onClick={() => setFilter('occupied')}
                    color={filter === 'occupied' ? 'secondary' : 'default'}
                    sx={{ fontWeight: 600 }}
                />
                <Chip
                    label="Dirty"
                    onClick={() => setFilter('dirty')}
                    color={filter === 'dirty' ? 'warning' : 'default'}
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {/* Floor Sections */}
            {Object.keys(roomsByFloor).sort().map((floor) => {
                const floorRooms = filteredRooms(roomsByFloor[floor]);
                const isExpanded = expandedFloors.has(floor);

                return (
                    <Box key={floor} sx={{ mb: 2 }}>
                        <ListItemButton
                            onClick={() => toggleFloor(floor)}
                            sx={{
                                bgcolor: 'grey.100',
                                borderRadius: 2,
                                mb: 1,
                                py: 1.5,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    Floor {floor}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {floorRooms.length} rooms
                                    </Typography>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </Box>
                            </Box>
                        </ListItemButton>

                        <Collapse in={isExpanded}>
                            <List sx={{ p: 0 }}>
                                {floorRooms.map((room) => {
                                    const colors = statusColors[room.status];
                                    return (
                                        <ListItem
                                            key={room.roomNumber}
                                            sx={{ p: 0, mb: 1 }}
                                        >
                                            <Box
                                                onClick={() => onRoomClick(room)}
                                                onContextMenu={(e) => onRoomContextMenu(e, room)}
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    bgcolor: 'background.paper',
                                                    cursor: 'pointer',
                                                    minHeight: 44,
                                                    '&:active': {
                                                        bgcolor: 'action.selected',
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                        Room {room.roomNumber}
                                                    </Typography>
                                                    {room.guestName && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {room.guestName === 'S.C' ? 'Sarah Chen' :
                                                                room.guestName === 'A.P' ? 'Alex Patel' :
                                                                    room.guestName === 'J.D' ? 'John Doe' :
                                                                        room.guestName === 'M.K' ? 'Michael Kumar' :
                                                                            room.guestName === 'R.S' ? 'Rachel Smith' : room.guestName}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Chip
                                                    label={getStatusLabel(room.status)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: colors.bg,
                                                        color: colors.text,
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Box>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Collapse>
                    </Box>
                );
            })}
        </Box>
    );
});

export default MobileRoomList;
