"use client";

import { Box, Paper, Tabs, Tab, Typography, Button, Stack } from "@mui/material";
import { useState, useCallback, MouseEvent } from "react";
import MainLayout from "@/layouts/MainLayout";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomDetailsPanel } from "@/components/rooms/RoomDetailsPanel";
import { StatusLegend } from "@/components/rooms/StatusLegend";
import RoomContextMenu from "@/components/rooms/RoomContextMenu";
import { HousekeepingMode } from "@/components/rooms/HousekeepingMode";
import { CleaningChecklist } from "@/components/rooms/CleaningChecklist";
import { mockRoomsData, mockFloorLayouts, getRoomStats, Room, RoomStatus } from "@/data/mockFloorPlanData";
import { useRoomStatus } from "@/hooks/useRoomStatus";
import { Building2, Sparkles, LayoutDashboard } from "lucide-react";

export default function RoomsPage() {
    const [selectedFloor, setSelectedFloor] = useState<number>(2);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
    const [contextMenu, setContextMenu] = useState<{ top: number; left: number; room: Room } | null>(null);
    const [viewMode, setViewMode] = useState<'management' | 'housekeeping'>('management');
    const [isCleaning, setIsCleaning] = useState(false);

    // Use room status hook
    const { rooms, changeRoomStatus, animatingRooms } = useRoomStatus(mockRoomsData);

    // Filter rooms by floor and status
    const filteredRooms = rooms.filter(room => {
        const floorMatch = selectedFloor === 0 || room.floor === selectedFloor;
        const statusMatch = statusFilter === 'all' || room.status === statusFilter;
        return floorMatch && statusMatch;
    });

    // Get stats for current filter
    const stats = getRoomStats(selectedFloor === 0 ? rooms : rooms.filter(r => r.floor === selectedFloor));

    const handleRoomClick = useCallback((room: Room) => {
        setSelectedRoom(room);
        if (viewMode === 'housekeeping' && room.status === 'dirty') {
            setIsCleaning(true);
        }
    }, [viewMode]);

    const handleRoomContextMenu = useCallback((event: MouseEvent<HTMLDivElement>, room: Room) => {
        event.preventDefault();
        setContextMenu({
            top: event.clientY,
            left: event.clientX,
            room,
        });
    }, []);

    const handleContextMenuClose = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleStatusChange = useCallback((roomId: string, newStatus: RoomStatus) => {
        changeRoomStatus(roomId, newStatus);
        // Update selected room if it's the one being changed
        if (selectedRoom?.id === roomId) {
            setSelectedRoom(prev => prev ? { ...prev, status: newStatus } : null);
        }
    }, [changeRoomStatus, selectedRoom]);

    const handleFilterChange = useCallback((filter: RoomStatus | 'all') => {
        setStatusFilter(filter);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setSelectedRoom(null);
        setIsCleaning(false);
    }, []);

    const handleCompleteCleaning = useCallback((roomId: string) => {
        handleStatusChange(roomId, 'vacant');
        setIsCleaning(false);
    }, [handleStatusChange]);

    return (
        <MainLayout>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Building2 size={28} />
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Room Management
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Interactive floor plan and room status management
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant={viewMode === 'management' ? 'contained' : 'outlined'}
                        startIcon={<LayoutDashboard size={18} />}
                        onClick={() => setViewMode('management')}
                        size="small"
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Management
                    </Button>
                    <Button
                        variant={viewMode === 'housekeeping' ? 'contained' : 'outlined'}
                        startIcon={<Sparkles size={18} />}
                        onClick={() => setViewMode('housekeeping')}
                        size="small"
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Housekeeping
                    </Button>
                </Stack>
            </Box>

            {viewMode === 'housekeeping' ? (
                <HousekeepingMode onBack={() => setViewMode('management')} />
            ) : (
                <>
                    {/* Floor Selector */}
                    <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Tabs
                            value={selectedFloor}
                            onChange={(_, value) => setSelectedFloor(value)}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    minHeight: 56,
                                },
                            }}
                        >
                            <Tab label="All Floors" value={0} />
                            {mockFloorLayouts.map((floor) => (
                                <Tab key={floor.floor} label={floor.name} value={floor.floor} />
                            ))}
                        </Tabs>
                    </Paper>

                    {/* Main Content - Three Column Layout */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr', lg: '240px 1fr 320px' }, gap: 3 }}>
                        {/* Left Panel - Stats & Legend */}
                        <Box>
                            <StatusLegend
                                stats={stats}
                                selectedFilter={statusFilter}
                                onFilterChange={handleFilterChange}
                            />
                        </Box>

                        {/* Center Panel - Floor Plan */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                minHeight: 600,
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                                {selectedFloor === 0 ? 'All Rooms' : mockFloorLayouts.find(f => f.floor === selectedFloor)?.name}
                            </Typography>

                            {/* Floor Plan Grid */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                                    gap: 2,
                                    justifyItems: 'center',
                                }}
                            >
                                {filteredRooms.map((room) => (
                                    <Box
                                        key={room.id}
                                        sx={{
                                            animation: animatingRooms.has(room.id) ? 'statusChange 0.3s ease-in-out' : 'none',
                                            '@keyframes statusChange': {
                                                '0%': { transform: 'scale(1)' },
                                                '50%': { transform: 'scale(1.1)' },
                                                '100%': { transform: 'scale(1)' },
                                            },
                                        }}
                                    >
                                        <RoomCard
                                            room={room}
                                            isSelected={selectedRoom?.id === room.id}
                                            onClick={handleRoomClick}
                                            onContextMenu={handleRoomContextMenu}
                                        />
                                    </Box>
                                ))}
                            </Box>


                            {filteredRooms.length === 0 && (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography color="text.secondary">
                                        No rooms match the current filter
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Right Panel - Room Details (Desktop only) */}
                        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                            {isCleaning && selectedRoom ? (
                                <CleaningChecklist
                                    room={selectedRoom}
                                    onComplete={handleCompleteCleaning}
                                    onClose={handleCloseDetails}
                                />
                            ) : (
                                <RoomDetailsPanel
                                    room={selectedRoom}
                                    onClose={handleCloseDetails}
                                    onStartCleaning={() => setIsCleaning(true)}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Context Menu */}
                    <RoomContextMenu
                        room={contextMenu?.room || null}
                        anchorPosition={contextMenu ? { top: contextMenu.top, left: contextMenu.left } : null}
                        onClose={handleContextMenuClose}
                        onStatusChange={handleStatusChange}
                    />
                </>
            )}
        </MainLayout>
    );
}
