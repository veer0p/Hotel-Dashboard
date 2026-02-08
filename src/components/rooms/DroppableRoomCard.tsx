"use client";

import { useDroppable } from "@dnd-kit/core";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { Room } from "@/data/mockFloorPlanData";
import { HousekeepingStaff } from "@/data/mockHousekeepingData";
import { Sparkles, User } from "lucide-react";

interface DroppableRoomCardProps {
    room: Room;
    assignedStaff?: HousekeepingStaff;
}

export function DroppableRoomCard({ room, assignedStaff }: DroppableRoomCardProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: room.id,
    });

    return (
        <Paper
            ref={setNodeRef}
            elevation={0}
            sx={{
                p: 2,
                border: '2px dashed',
                borderColor: isOver ? 'primary.main' : assignedStaff ? 'success.main' : 'divider',
                bgcolor: isOver ? 'action.hover' : assignedStaff ? 'success.50' : 'background.paper',
                borderRadius: 2,
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minWidth: 140,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Room {room.number}
                </Typography>
                {room.status === 'dirty' && <Sparkles size={14} color="#F59E0B" />}
            </Box>

            <Typography variant="caption" color="text.secondary">
                {room.type}
            </Typography>

            {assignedStaff ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <User size={12} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {assignedStaff.name.split(' ')[0]}
                    </Typography>
                </Box>
            ) : (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                    No staff assigned
                </Typography>
            )}
        </Paper>
    );
}
