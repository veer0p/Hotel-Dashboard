"use client";

import { Drawer, Box, Typography, IconButton, Divider, Button, Chip, alpha } from "@mui/material";
import { XMarkIcon, UserIcon, HomeIcon, CurrencyDollarIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Reservation } from "@/lib/hooks/useCalendarState";
import { format } from "date-fns";

interface ReservationDetailProps {
    reservation: Reservation | null;
    onClose: () => void;
}

const statusColors = {
    confirmed: { bg: "#3b82f6", text: "#ffffff" },
    "checked-in": { bg: "#8b5cf6", text: "#ffffff" },
    "checked-out": { bg: "#6b7280", text: "#ffffff" },
    tentative: { bg: "#9ca3af", text: "#ffffff" },
    cancelled: { bg: "#ef4444", text: "#ffffff" },
};

export default function ReservationDetail({ reservation, onClose }: ReservationDetailProps) {
    if (!reservation) return null;

    const colors = statusColors[reservation.status];

    return (
        <Drawer
            anchor="right"
            open={Boolean(reservation)}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: "100%", sm: 400 } },
            }}
        >
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Reservation Details
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <XMarkIcon className="w-5 h-5" />
                    </IconButton>
                </Box>

                {/* Guest Info */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: alpha(colors.bg, 0.1),
                        borderRadius: 2,
                        borderLeft: 4,
                        borderColor: colors.bg,
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {reservation.guestName}
                        </Typography>
                        <Chip
                            label={reservation.status}
                            size="small"
                            sx={{
                                bgcolor: colors.bg,
                                color: colors.text,
                                fontWeight: 600,
                                textTransform: "capitalize",
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Reservation #{reservation.id}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Details Grid */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {/* Room */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "primary.lighter",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <HomeIcon className="w-5 h-5 text-primary-main" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Room Number
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {reservation.roomNumber}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Dates */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "success.lighter",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CalendarIcon className="w-5 h-5 text-success-main" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Check-in / Check-out
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {format(reservation.checkIn, "MMM d, yyyy")} - {format(reservation.checkOut, "MMM d, yyyy")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {reservation.nights} night{reservation.nights !== 1 ? "s" : ""}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Rate Plan */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "warning.lighter",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CurrencyDollarIcon className="w-5 h-5 text-warning-main" />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Rate Plan & Price
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {reservation.ratePlan}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                                ${reservation.price}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* History/Audit Log */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                        Status History
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {[
                            { date: "Oct 24, 10:15 AM", event: "Reservation Created", user: "Admin" },
                            { date: "Oct 25, 02:30 PM", event: "Room Assigned: 101", user: "System" },
                        ].map((log, i) => (
                            <Box key={i} sx={{ display: "flex", gap: 2 }}>
                                <Box sx={{ width: 4, bgcolor: "divider", borderRadius: 1 }} />
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                        {log.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {log.event}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        by {log.user}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Linked Reservations */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Linked Reservations (Group)
                    </Typography>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                John Smith (Family)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Room 102 • Oct 24-28
                            </Typography>
                        </Box>
                        <Button size="small">View</Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Actions */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Button variant="contained" fullWidth>
                        Check-in Early
                    </Button>
                    <Button variant="outlined" fullWidth>
                        Modify Reservation
                    </Button>
                    <Button variant="outlined" fullWidth>
                        Send Message
                    </Button>
                    <Button variant="outlined" color="error" fullWidth>
                        Cancel Reservation
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
