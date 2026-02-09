"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/layouts/MainLayout";
import {
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Stack,
    Avatar,
    Chip,
    Button,
    Divider,
    IconButton,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Search,
    ChevronRight,
    UserCheck,
    LogOut,
    Calendar,
    Filter
} from "lucide-react";
import { useReservations } from "@/hooks/useReservations";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

export default function CheckinPage() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const { propertyId } = useAuth();

    const {
        reservations,
        isLoading,
        error,
        checkIn,
        checkOut,
        isCheckingIn,
        isCheckingOut
    } = useReservations(propertyId || undefined, {
        status: tabValue === 0 ? ['confirmed'] : ['checked_in'],
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Simple search filtering on the fetched data
    const filteredReservations = useMemo(() => {
        if (!reservations) return [];
        return reservations.filter(res => {
            // Note: reservations from backend should ideally include guest names
            // For now, search matches reservation ID or number
            return res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.reservation_number.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [reservations, searchQuery]);

    const handleGuestClick = (id: string) => {
        router.push(`/reservations/${id}`);
    };

    const handleAction = async (e: React.MouseEvent, reservationId: string) => {
        e.stopPropagation();
        try {
            if (tabValue === 0) {
                await checkIn(reservationId);
                alert('Checked in successfully');
            } else {
                await checkOut(reservationId);
                alert('Checked out successfully');
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <MainLayout>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Check-in
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage guest arrivals and departures for today
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ width: isMobile ? '100%' : 'auto' }}>
                    <Button variant="outlined" startIcon={<Calendar size={18} />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                        Schedule
                    </Button>
                </Stack>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Arrivals" sx={{ fontWeight: 600, textTransform: 'none' }} />
                        <Tab label="Departures" sx={{ fontWeight: 600, textTransform: 'none' }} />
                    </Tabs>
                    <Box sx={{ pb: 1, width: isMobile ? '100%' : 'auto' }}>
                        <TextField
                            size="small"
                            placeholder="Reservation ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={18} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: isMobile ? '100%' : 250 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ minHeight: 400 }}>
                    {isLoading ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                            <Typography color="text.secondary">Loading reservations...</Typography>
                        </Stack>
                    ) : filteredReservations.length === 0 ? (
                        <Stack alignItems="center" justifyContent="center" sx={{ py: 10, color: 'text.secondary' }}>
                            <Filter size={48} strokeWidth={1} />
                            <Typography sx={{ mt: 2 }}>No reservations found matching your criteria</Typography>
                        </Stack>
                    ) : (
                        <Stack divider={<Divider />}>
                            {filteredReservations.map((res) => (
                                <Box
                                    key={res.id}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                    onClick={() => handleGuestClick(res.id)}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar src={undefined} alt={res.reservation_number} sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.50' }} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {res.reservation_number}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="caption" color="text.secondary">ID: {res.id.substring(0, 8)}...</Typography>
                                                <Typography variant="caption" color="text.secondary">•</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                    {res.room_id ? 'Room Assigned' : 'Room Not Assigned'}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={3} alignItems="center">
                                        {!isMobile && (
                                            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                                                    {tabValue === 0 ? 'Arrival' : 'Departure'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {tabValue === 0 ? format(new Date(res.check_in_date), "MMM d") : format(new Date(res.check_out_date), "MMM d")}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={isCheckingIn || isCheckingOut}
                                            startIcon={tabValue === 0 ? <UserCheck size={16} /> : <LogOut size={16} />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                bgcolor: tabValue === 0 ? 'primary.main' : 'error.main',
                                                '&:hover': {
                                                    bgcolor: tabValue === 0 ? 'primary.dark' : 'error.dark',
                                                }
                                            }}
                                            onClick={(e) => handleAction(e, res.id)}
                                        >
                                            {tabValue === 0 ? 'Check-in' : 'Check-out'}
                                        </Button>

                                        <IconButton size="small">
                                            <ChevronRight size={20} />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Paper>
        </MainLayout>
    );
}
