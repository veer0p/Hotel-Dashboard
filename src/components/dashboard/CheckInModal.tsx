"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";

interface CheckInModalProps {
    open: boolean;
    onClose: () => void;
    guestName?: string;
    room?: string;
}

export default function CheckInModal({ open, onClose, guestName = "", room = "" }: CheckInModalProps) {
    const [formData, setFormData] = useState({
        name: guestName,
        email: "",
        phone: "",
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: "",
        room: room,
    });

    const handleSubmit = () => {
        console.log("Check-in data:", formData);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, fontSize: '24px' }}>
                Quick Check-in
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField
                        label="Guest Name"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        variant="outlined"
                    />

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        variant="outlined"
                    />

                    <TextField
                        label="Phone"
                        type="tel"
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        variant="outlined"
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Check-in Date"
                            type="date"
                            fullWidth
                            value={formData.checkIn}
                            onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />

                        <TextField
                            label="Check-out Date"
                            type="date"
                            fullWidth
                            value={formData.checkOut}
                            onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>

                    <TextField
                        label="Room Number"
                        fullWidth
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        variant="outlined"
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                    Complete Check-in
                </Button>
            </DialogActions>
        </Dialog>
    );
}
