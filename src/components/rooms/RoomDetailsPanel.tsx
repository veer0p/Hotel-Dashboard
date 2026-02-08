"use client";

import { Box, Paper, Typography, Button, Divider, Chip } from "@mui/material";
import { Room } from "@/data/mockFloorPlanData";
import { X, User, DollarSign, Calendar, Clock, MessageSquare, CreditCard, LogOut, Plus, Wrench, History } from "lucide-react";
import { memo } from "react";

interface RoomDetailsPanelProps {
    room: Room | null;
    onClose: () => void;
    onStartCleaning?: (roomId: string) => void;
}

const statusConfig = {
    vacant: { color: '#10B981', label: 'Vacant' },
    occupied: { color: '#8B5CF6', label: 'Occupied' },
    dirty: { color: '#F59E0B', label: 'Needs Cleaning' },
    maintenance: { color: '#EF4444', label: 'Maintenance' },
};

const RoomDetailsPanelComponent = ({ room, onClose, onStartCleaning }: RoomDetailsPanelProps) => {
    if (!room) {
        return (
            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography color="text.secondary">
                    Select a room to view details
                </Typography>
            </Paper>
        );
    }

    const config = statusConfig[room.status];

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'auto',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Room {room.number}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {room.type.charAt(0).toUpperCase() + room.type.slice(1)} • Floor {room.floor}
                    </Typography>
                </Box>
                <Button
                    onClick={onClose}
                    sx={{ minWidth: 'auto', p: 1, color: 'text.secondary' }}
                >
                    <X size={20} />
                </Button>
            </Box>

            {/* Status Badge */}
            <Box sx={{ p: 2 }}>
                <Chip
                    label={config.label}
                    sx={{
                        bgcolor: config.color,
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '13px',
                    }}
                />
            </Box>

            {/* Guest Information */}
            {room.currentGuest && (
                <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <User size={16} />
                        Guest Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Name</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{room.currentGuest.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Check-in</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{room.currentGuest.checkIn}</Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary">Check-out</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{room.currentGuest.checkOut}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Room Details */}
            <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DollarSign size={16} />
                    Room Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Rate per night</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>${room.rate}</Typography>
                    </Box>
                    {room.revenue && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>${room.revenue}</Typography>
                        </Box>
                    )}
                    {room.lastCleaned && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Last Cleaned</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Today 9:00 AM</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Divider />

            {/* Quick Actions */}
            {room.status === 'occupied' && (
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<MessageSquare size={16} />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Message Guest
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CreditCard size={16} />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Add Charge
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<LogOut size={16} />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Early Check-out
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Plus size={16} />}
                            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                        >
                            Extend Stay
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Housekeeping Actions */}
            {(room.status === 'dirty' || room.status === 'occupied') && (
                <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                            Housekeeping
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => room && onStartCleaning?.(room.id)}
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            >
                                Start Cleaning
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            >
                                Mark as Clean
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            >
                                Request Towels
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                            >
                                Report Issue
                            </Button>
                        </Box>
                    </Box>
                </>
            )}

            {/* Maintenance Actions */}
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Maintenance
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Wrench size={16} />}
                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                    >
                        Schedule Maintenance
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<History size={16} />}
                        sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                    >
                        View History
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export const RoomDetailsPanel = memo(RoomDetailsPanelComponent);
