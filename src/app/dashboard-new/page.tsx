"use client";

import { Box, Typography, Paper, Button, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, useEffect, useCallback, MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/MainLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import RoomMiniCard from "@/components/dashboard/RoomMiniCard";
import ScheduleTable from "@/components/dashboard/ScheduleTable";
import RoomDetailSlideOver from "@/components/dashboard/RoomDetailSlideOver";
import RoomContextMenu from "@/components/dashboard/RoomContextMenu";
import { useRooms } from "@/hooks/useRooms";
import { useReservations } from "@/hooks/useReservations";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Calendar, UserPlus, List } from "lucide-react";

export default function DashboardNew() {
    const router = useRouter();
    const { user, propertyId } = useAuth();

    const { rooms, isLoading: roomsLoading } = useRooms(propertyId || undefined);
    const { reservations, isLoading: reservationsLoading } = useReservations(propertyId || undefined, {
        check_in_date_from: format(new Date(), 'yyyy-MM-dd'),
        check_in_date_to: format(new Date(), 'yyyy-MM-dd'),
    });

    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; room: any } | null>(null);

    const handleRoomClick = useCallback((room: any) => {
        setSelectedRoom(room);
    }, []);

    const handleRoomContextMenu = useCallback((event: MouseEvent<HTMLDivElement>, room: any) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX,
                    mouseY: event.clientY,
                    room,
                }
                : null,
        );
    }, [contextMenu]);

    const handleContextMenuClose = useCallback(() => {
        setContextMenu(null);
    }, []);

    const handleMarkClean = useCallback(() => {
        console.log('Mark clean:', contextMenu?.room.roomNumber);
    }, [contextMenu]);

    const handleBlockMaintenance = useCallback(() => {
        console.log('Block maintenance:', contextMenu?.room.roomNumber);
    }, [contextMenu]);

    const handleViewHistory = useCallback(() => {
        console.log('View history:', contextMenu?.room.roomNumber);
    }, [contextMenu]);

    // Map real rooms to UI format
    const mappedRooms = useMemo(() => {
        if (!rooms) return [];
        return rooms.map(room => ({
            roomNumber: room.room_number,
            status: room.status as any,
            type: room.room_type?.name,
            id: room.id
        }));
    }, [rooms]);

    // Map real reservations to schedule items
    const scheduleItems = useMemo(() => {
        if (!reservations) return [];
        return reservations.map(res => ({
            time: format(new Date(res.created_at), 'h:mm a'),
            guest: `Res: ${res.reservation_number}`,
            room: res.room_id ? 'Assigned' : 'TBD',
            action: res.status === 'confirmed' ? 'check-in' : 'check-out',
            actionLabel: res.status === 'confirmed' ? 'Check-in' : 'Check-out'
        }));
    }, [reservations]);

    // Calculate live metrics
    const metrics = useMemo(() => {
        const totalRooms = rooms?.length || 0;
        const occupiedRooms = rooms?.filter(r => r.status === 'occupied').length || 0;
        const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        const arrivals = reservations?.filter(r => r.status === 'confirmed').length || 0;
        const departures = reservations?.filter(r => r.status === 'checked_in').length || 0;

        // Calculate Revenue from confirmed/checked-in/checked-out reservations
        const totalRevenue = reservations?.reduce((acc, res) => {
            // Only count if it's a valid stay status
            if (['confirmed', 'checked_in', 'checked_out'].includes(res.status)) {
                return acc + (res.total_amount || 0);
            }
            return acc;
        }, 0) || 0;

        const formattedRevenue = `₹${totalRevenue.toLocaleString('en-IN')}`;

        return [
            {
                label: "Occupancy",
                value: `${occupancy}%`,
                trend: 0,
                trendDirection: 'neutral'
            },
            {
                label: "Revenue",
                value: formattedRevenue,
                trend: 0,
                trendDirection: 'neutral'
            },
            {
                label: "Arrivals",
                value: arrivals.toString(),
                trend: 0,
                trendDirection: 'neutral'
            },
            {
                label: "Checkouts",
                value: departures.toString(),
                trend: 0,
                trendDirection: 'neutral'
            }
        ];
    }, [rooms, reservations]);

    const getShiftContext = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 14) return {
            greeting: `Morning, ${user?.user_metadata?.first_name || 'Sarah'}`,
            focus: "Shift Focus: Breakfast service & Morning check-outs"
        };
        if (hour >= 14 && hour < 22) return {
            greeting: "Afternoon Pulse",
            focus: "Shift Focus: Peak check-ins & Room turnovers"
        };
        return {
            greeting: "Night Watch",
            focus: "Shift Focus: Audit reports & Late arrivals"
        };
    };

    const shiftContext = getShiftContext();

    if (roomsLoading || reservationsLoading) {
        return (
            <MainLayout>
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={300} height={48} />
                    <Skeleton variant="text" width={500} height={24} sx={{ mt: 1 }} />
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                        </Grid>
                    ))}
                </Grid>

                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 4 }} />
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {shiftContext.greeting}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '16px' }}>
                    {shiftContext.focus}
                </Typography>
            </Box>

            {/* Metrics Section */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {metrics.map((metric, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <MetricCard metric={metric as any} />
                    </Grid>
                ))}
            </Grid>

            {/* Living Floor Plan Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Living Floor Plan
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
                            <Typography variant="caption" color="text.secondary">Vacant</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#8B5CF6' }} />
                            <Typography variant="caption" color="text.secondary">Occupied</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                            <Typography variant="caption" color="text.secondary">Dirty</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#EF4444' }} />
                            <Typography variant="caption" color="text.secondary">Maintenance</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            bgcolor: 'grey.100',
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bgcolor: 'grey.400',
                            borderRadius: 4,
                            '&:hover': {
                                bgcolor: 'grey.500',
                            },
                        },
                    }}
                >
                    {mappedRooms.length > 0 ? mappedRooms.map((room) => (
                        <RoomMiniCard
                            key={room.roomNumber}
                            room={room as any}
                            onClick={handleRoomClick}
                            onContextMenu={handleRoomContextMenu}
                        />
                    )) : (
                        <Typography color="text.secondary">No rooms configured</Typography>
                    )}
                </Box>
            </Paper>

            {/* Today's Schedule Section */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Today&apos;s Schedule
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<UserPlus size={18} />}
                            onClick={() => router.push('/checkin')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            Quick Check-in
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Calendar size={18} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            New Booking
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<List size={18} />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            View All
                        </Button>
                    </Box>
                </Box>

                <ScheduleTable scheduleItems={scheduleItems as any} />
            </Box>

            {/* Interactive Components */}
            <RoomDetailSlideOver
                open={selectedRoom !== null}
                onClose={() => setSelectedRoom(null)}
                room={selectedRoom}
            />

            <RoomContextMenu
                anchorEl={contextMenu ? { getBoundingClientRect: () => ({ top: contextMenu.mouseY, left: contextMenu.mouseX, right: contextMenu.mouseX, bottom: contextMenu.mouseY, width: 0, height: 0, x: contextMenu.mouseX, y: contextMenu.mouseY, toJSON: () => ({}) }) } as HTMLElement : null}
                open={contextMenu !== null}
                onClose={handleContextMenuClose}
                roomStatus={contextMenu?.room.status || 'vacant'}
                onMarkClean={handleMarkClean}
                onBlockMaintenance={handleBlockMaintenance}
                onViewHistory={handleViewHistory}
            />
        </MainLayout>
    );
}
