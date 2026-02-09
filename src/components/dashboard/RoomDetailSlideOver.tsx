"use client";

import { Drawer, Box, Typography, IconButton, Divider, Chip, Button } from "@mui/material";
import { X, User, Calendar, CreditCard, Phone, Mail, MapPin } from "lucide-react";
import { RoomStatus } from "@/data/mockDashboardData";

interface RoomDetailSlideOverProps {
    open: boolean;
    onClose: () => void;
    room: RoomStatus | null;
}

export default function RoomDetailSlideOver({ open, onClose, room }: RoomDetailSlideOverProps) {
    if (!room) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'vacant': return 'success';
            case 'occupied': return 'secondary';
            case 'dirty': return 'warning';
            case 'maintenance': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: 400 },
                    backdropFilter: 'blur(8px)',
                },
            }}
        >
            <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Room {room.roomNumber}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                {/* Status Badge */}
                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={getStatusLabel(room.status)}
                        color={getStatusColor(room.status)}
                        sx={{ fontWeight: 600, fontSize: '14px' }}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Guest Information (if occupied) */}
                {room.status === 'occupied' && room.guestName && (
                    <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                            GUEST INFORMATION
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <User size={18} className="text-gray-500" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Guest Name</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {room.guestName === 'S.C' ? 'Sarah Chen' :
                                            room.guestName === 'A.P' ? 'Alex Patel' :
                                                room.guestName === 'J.D' ? 'John Doe' :
                                                    room.guestName === 'M.K' ? 'Michael Kumar' :
                                                        room.guestName === 'R.S' ? 'Rachel Smith' : room.guestName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Calendar size={18} className="text-gray-500" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Check-in / Check-out</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Feb 6, 2026 - Feb 10, 2026
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Phone size={18} className="text-gray-500" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        +1 (555) 123-4567
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Mail size={18} className="text-gray-500" />
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Email</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        guest@example.com
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />
                    </>
                )}

                {/* Room Details */}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                    ROOM DETAILS
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Room Type</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Deluxe Suite</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Floor</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {room.roomNumber.charAt(0)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Bed Type</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>King Size</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Rate</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>₹250/night</Typography>
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {room.status === 'dirty' && (
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            Mark as Clean
                        </Button>
                    )}

                    {room.status === 'vacant' && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            Quick Check-in
                        </Button>
                    )}

                    {room.status === 'occupied' && (
                        <>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                Check-out
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            >
                                View Full Profile
                            </Button>
                        </>
                    )}

                    {room.status === 'maintenance' && (
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                            Mark Maintenance Complete
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                        View History
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
