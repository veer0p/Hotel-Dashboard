"use client";

import { Box, Typography, Paper, Button, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import RoomMiniCard from "@/components/dashboard/RoomMiniCard";
import ScheduleTable from "@/components/dashboard/ScheduleTable";
import { mockMetrics, mockRooms, mockSchedule } from "@/data/mockDashboardData";
import { Calendar, UserPlus, List } from "lucide-react";

export default function DashboardNew() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
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
                    Today&apos;s Pulse
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '16px' }}>
                    Real-time overview of your hotel operations
                </Typography>
            </Box>

            {/* Metrics Section */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {mockMetrics.map((metric, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <MetricCard metric={metric} />
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
                    {mockRooms.map((room) => (
                        <RoomMiniCard key={room.roomNumber} room={room} />
                    ))}
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

                <ScheduleTable scheduleItems={mockSchedule} />
            </Box>
        </MainLayout>
    );
}
