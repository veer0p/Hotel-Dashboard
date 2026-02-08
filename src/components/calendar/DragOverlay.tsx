"use client";

import { Box, Paper, Typography, alpha } from "@mui/material";
import { DragState } from "@/lib/hooks/useDragDrop";
import { format } from "date-fns";

interface DragOverlayProps {
    dragState: DragState;
}

const statusColors = {
    confirmed: "#3b82f6",
    "checked-in": "#8b5cf6",
    "checked-out": "#6b7280",
    tentative: "#9ca3af",
    cancelled: "#ef4444",
};

export default function DragOverlay({ dragState }: DragOverlayProps) {
    if (!dragState.isDragging || !dragState.draggedReservation || !dragState.previewDates) {
        return null;
    }

    const reservation = dragState.draggedReservation;
    const color = statusColors[reservation.status];

    return (
        <Paper
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 2,
                minWidth: 250,
                bgcolor: alpha(color, 0.95),
                color: "white",
                boxShadow: 6,
                borderRadius: 2,
                border: 3,
                borderStyle: "dashed",
                borderColor: dragState.isValidDrop ? "success.light" : "error.light",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                {reservation.guestName}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Room: {dragState.targetRoom || reservation.roomNumber}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {format(dragState.previewDates.checkIn, "MMM d")} -{" "}
                    {format(dragState.previewDates.checkOut, "MMM d")}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Mode: {dragState.dragMode}
                </Typography>
            </Box>

            {!dragState.isValidDrop && (
                <Box
                    sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: 1,
                        borderColor: alpha("#fff", 0.3),
                    }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "error.light" }}>
                        ⚠️ Invalid drop location
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
