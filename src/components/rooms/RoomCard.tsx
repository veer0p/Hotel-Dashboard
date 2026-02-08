"use client";

import { Box, Typography, Tooltip, Chip } from "@mui/material";
import { Room } from "@/data/mockFloorPlanData";
import { memo, MouseEvent } from "react";
import { User, Wrench, Sparkles } from "lucide-react";

interface RoomCardProps {
    room: Room;
    isSelected?: boolean;
    onClick: (room: Room) => void;
    onContextMenu: (event: MouseEvent<HTMLDivElement>, room: Room) => void;
}

const statusConfig = {
    vacant: {
        bg: '#10B981',
        border: '#059669',
        text: '#ffffff',
        label: 'Vacant',
    },
    occupied: {
        bg: '#8B5CF6',
        border: '#7C3AED',
        text: '#ffffff',
        label: 'Occupied',
    },
    dirty: {
        bg: '#F59E0B',
        border: '#D97706',
        text: '#ffffff',
        label: 'Needs Cleaning',
    },
    maintenance: {
        bg: '#EF4444',
        border: '#DC2626',
        text: '#ffffff',
        label: 'Maintenance',
    },
};

const RoomCardComponent = ({ room, isSelected, onClick, onContextMenu }: RoomCardProps) => {
    const config = statusConfig[room.status];

    const getTooltipContent = () => {
        if (room.status === 'occupied' && room.currentGuest) {
            return `${room.currentGuest.name} • ${room.currentGuest.checkIn} to ${room.currentGuest.checkOut}`;
        }
        if (room.status === 'dirty') {
            return `Needs cleaning • Last cleaned: ${room.lastCleaned || 'N/A'}`;
        }
        if (room.status === 'maintenance') {
            return 'Under maintenance';
        }
        return `Available • ${room.type} • $${room.rate}/night`;
    };

    const getStatusIcon = () => {
        switch (room.status) {
            case 'occupied':
                return <User size={14} />;
            case 'maintenance':
                return <Wrench size={14} />;
            case 'dirty':
                return <Sparkles size={14} />;
            default:
                return null;
        }
    };

    return (
        <Tooltip title={getTooltipContent()} arrow placement="top">
            <Box
                onClick={() => onClick(room)}
                onContextMenu={(e) => onContextMenu(e, room)}
                sx={{
                    width: 90,
                    height: 90,
                    borderRadius: 1.5,
                    border: '3px solid',
                    borderColor: isSelected ? '#3B82F6' : config.border,
                    bgcolor: config.bg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 10px 15px -3px rgb(0 0 0 / 0.2)' : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    },
                    '&:active': {
                        transform: 'scale(0.98)',
                    },
                }}
            >
                {/* Status Icon */}
                {getStatusIcon() && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            color: config.text,
                            opacity: 0.8,
                        }}
                    >
                        {getStatusIcon()}
                    </Box>
                )}

                {/* Room Type Badge */}
                {room.type === 'suite' && (
                    <Chip
                        label="Suite"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 4,
                            left: 4,
                            height: 16,
                            fontSize: '9px',
                            fontWeight: 700,
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            color: config.text,
                            '& .MuiChip-label': {
                                px: 0.5,
                            },
                        }}
                    />
                )}

                {/* Room Number */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: config.text,
                        fontSize: '18px',
                        lineHeight: 1,
                    }}
                >
                    {room.number}
                </Typography>

                {/* Guest Initials */}
                {room.currentGuest && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: config.text,
                            fontSize: '11px',
                            fontWeight: 600,
                            opacity: 0.9,
                        }}
                    >
                        {room.currentGuest.initials}
                    </Typography>
                )}

                {/* Rate */}
                {room.status === 'vacant' && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: config.text,
                            fontSize: '10px',
                            fontWeight: 500,
                            opacity: 0.8,
                        }}
                    >
                        ${room.rate}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
};

export const RoomCard = memo(RoomCardComponent);
