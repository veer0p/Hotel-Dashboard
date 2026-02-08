"use client";

import { Box, Typography, Tooltip } from "@mui/material";
import { RoomStatus } from "@/data/mockDashboardData";
import { useState, MouseEvent, memo } from "react";

interface RoomMiniCardProps {
    room: RoomStatus;
    onClick: (room: RoomStatus) => void;
    onContextMenu: (event: MouseEvent<HTMLDivElement>, room: RoomStatus) => void;
}

const statusColors = {
    vacant: {
        bg: '#10B981',
        border: '#059669',
        text: '#ffffff',
    },
    occupied: {
        bg: '#8B5CF6',
        border: '#7C3AED',
        text: '#ffffff',
    },
    dirty: {
        bg: '#F59E0B',
        border: '#D97706',
        text: '#ffffff',
    },
    maintenance: {
        bg: '#EF4444',
        border: '#DC2626',
        text: '#ffffff',
    },
};


const RoomMiniCard = memo(function RoomMiniCard({ room, onClick, onContextMenu }: RoomMiniCardProps) {
    const colors = statusColors[room.status];
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        onClick(room);
    };

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onContextMenu(e, room);
    };

    const getTooltipContent = () => {
        if (room.status === 'occupied' && room.guestName) {
            const fullName = room.guestName === 'S.C' ? 'Sarah Chen' :
                room.guestName === 'A.P' ? 'Alex Patel' :
                    room.guestName === 'J.D' ? 'John Doe' :
                        room.guestName === 'M.K' ? 'Michael Kumar' :
                            room.guestName === 'R.S' ? 'Rachel Smith' : room.guestName;
            return `${fullName} • Feb 6-10, 2026`;
        }
        return `Room ${room.roomNumber} • ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`;
    };

    return (
        <Tooltip title={getTooltipContent()} arrow placement="top">
            <Box
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    width: 80,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    border: '3px solid',
                    borderColor: colors.border,
                    bgcolor: colors.bg,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isHovered ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 700,
                        color: colors.text,
                        fontSize: '16px',
                    }}
                >
                    {room.roomNumber}
                </Typography>

                {room.guestName && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.text,
                            fontSize: '11px',
                            fontWeight: 500,
                        }}
                    >
                        {room.guestName}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
});

export default RoomMiniCard;
