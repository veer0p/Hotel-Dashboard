"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Grid,
    MenuItem,
    alpha
} from "@mui/material";
import { format, addDays } from "date-fns";

interface QuickBookingProps {
    open: boolean;
    onClose: () => void;
    onSave: (booking: any) => void;
    initialData?: {
        checkIn?: Date;
        checkOut?: Date;
        roomNumber?: string;
    };
}

export default function QuickBooking({ open, onClose, onSave, initialData }: QuickBookingProps) {
    const [formData, setFormData] = useState({
        guestName: "",
        roomNumber: initialData?.roomNumber || "101",
        checkIn: initialData?.checkIn ? format(initialData.checkIn, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        checkOut: initialData?.checkOut ? format(initialData.checkOut, "yyyy-MM-dd") : format(addDays(new Date(), 1), "yyyy-MM-dd"),
        ratePlan: "Standard",
        status: "confirmed"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave({
            ...formData,
            checkIn: new Date(formData.checkIn),
            checkOut: new Date(formData.checkOut),
            price: 150, // Mock price
            nights: 1, // Mock nights
            id: Math.random().toString(36).substr(2, 9)
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Quick Booking</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                        fullWidth
                        label="Guest Name"
                        name="guestName"
                        value={formData.guestName}
                        onChange={handleChange}
                        variant="outlined"
                        autoFocus
                    />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Check-in Date"
                                type="date"
                                name="checkIn"
                                value={formData.checkIn}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                fullWidth
                                label="Check-out Date"
                                type="date"
                                name="checkOut"
                                value={formData.checkOut}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Room"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                            >
                                {["101", "102", "103", "201", "202", "301"].map((room) => (
                                    <MenuItem key={room} value={room}>
                                        Room {room}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Rate Plan"
                                name="ratePlan"
                                value={formData.ratePlan}
                                onChange={handleChange}
                            >
                                {["Standard", "Weekend Special", "Advance Purchase", "Corporate"].map((plan) => (
                                    <MenuItem key={plan} value={plan}>
                                        {plan}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Create Reservation
                </Button>
            </DialogActions>
        </Dialog>
    );
}
