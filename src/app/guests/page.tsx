"use client";

import { useState, useMemo } from "react";
import MainLayout from "@/layouts/MainLayout";
import {
    Box,
    Typography,
    Button,
    Paper,
    InputAdornment,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Table,
    TableBody,
    Divider,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    useMediaQuery,
    Stack,
    Avatar,
    Grid
} from "@mui/material";

import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    ChevronRight,
    Users,
    Crown,
    BedDouble,
    TrendingUp
} from "lucide-react";
import { mockGuests, Guest } from "@/data/mockGuestData";
import { useRouter } from "next/navigation";

export default function GuestsPage() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Stats Calculation
    const stats = useMemo(() => {
        const total = mockGuests.length;
        const vip = mockGuests.filter(g => g.status === 'VIP').length;
        const active = mockGuests.filter(g => g.currentContext?.status.includes('Arriving') || g.currentContext?.status.includes('In-House')).length; // impactful approximation
        const newThisMonth = 4; // Mock data static for now
        return { total, vip, active, newThisMonth };
    }, []);

    // Filter Logic
    const filteredGuests = useMemo(() => {
        return mockGuests.filter(guest => {
            const matchesSearch =
                guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guest.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const handleGuestClick = (id: string) => {
        router.push(`/guests/${id}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VIP': return { bg: '#8B5CF6', color: 'white' };
            case 'Loyal': return { bg: '#10B981', color: 'white' };
            default: return { bg: theme.palette.primary.main, color: 'white' };
        }
    };

    return (
        <MainLayout>
            {/* Header & Actions */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Guests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage guest profiles, history, and preferences
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        width: isMobile ? '100%' : 'auto'
                    }}
                >
                    Add Guest
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 2, color: 'primary.main' }}>
                                <Users size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
                                <Typography variant="body2" color="text.secondary">Total Guests</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, bgcolor: '#F3E8FF', borderRadius: 2, color: '#9333EA' }}>
                                <Crown size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.vip}</Typography>
                                <Typography variant="body2" color="text.secondary">VIP Members</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, bgcolor: 'success.50', borderRadius: 2, color: 'success.main' }}>
                                <BedDouble size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.active}</Typography>
                                <Typography variant="body2" color="text.secondary">Active Stays</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ p: 1.5, bgcolor: 'warning.50', borderRadius: 2, color: 'warning.main' }}>
                                <TrendingUp size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>+{stats.newThisMonth}</Typography>
                                <Typography variant="body2" color="text.secondary">New This Month</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* Filters */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                    <TextField
                        placeholder="Search guests..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="VIP">VIP</MenuItem>
                            <MenuItem value="Loyal">Loyal</MenuItem>
                            <MenuItem value="Regular">Regular</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="outlined" startIcon={<Filter size={18} />} sx={{ textTransform: 'none' }}>
                        More Filters
                    </Button>
                </Stack>
            </Paper>

            {/* Content Display */}
            {isMobile ? (
                // Mobile Card View
                <Stack spacing={2}>
                    {filteredGuests.map((guest) => (
                        <Paper
                            key={guest.id}
                            elevation={0}
                            onClick={() => handleGuestClick(guest.id)}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:active': { bgcolor: 'action.hover' }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar src={guest.avatar} alt={guest.name} sx={{ width: 48, height: 48 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {guest.name}
                                        </Typography>
                                        <Chip
                                            label={guest.status}
                                            size="small"
                                            sx={{
                                                bgcolor: getStatusColor(guest.status).bg,
                                                color: getStatusColor(guest.status).color,
                                                fontWeight: 700,
                                                height: 20,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                </Stack>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}>
                                    <MoreVertical size={20} />
                                </IconButton>
                            </Box>

                            <Stack spacing={1.5} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                                    <Mail size={16} />
                                    {guest.email}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                                    <Phone size={16} />
                                    {guest.phone}
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 1.5 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">LTV</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>${guest.lifetimeValue.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary">Stays</Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{guest.staysCount}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                // Desktop Table View
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Guest</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Stays</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">LTV</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGuests.map((guest) => (
                                <TableRow
                                    key={guest.id}
                                    hover
                                    onClick={() => handleGuestClick(guest.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar src={guest.avatar} alt={guest.name} />
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {guest.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {guest.id}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2">{guest.email}</Typography>
                                            <Typography variant="caption" color="text.secondary">{guest.phone}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={guest.status}
                                            size="small"
                                            sx={{
                                                bgcolor: getStatusColor(guest.status).bg,
                                                color: getStatusColor(guest.status).color,
                                                fontWeight: 600
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {guest.staysCount}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            ${guest.lifetimeValue.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}>
                                            <ChevronRight size={20} className="text-gray-400" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </MainLayout>
    );
}
