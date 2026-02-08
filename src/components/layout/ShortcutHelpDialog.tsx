"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
    Divider,
} from "@mui/material";
import { XIcon } from "lucide-react";

interface ShortcutHelpDialogProps {
    open: boolean;
    onClose: () => void;
}

interface Shortcut {
    key: string;
    description: string;
}

interface ShortcutGroup {
    group: string;
    shortcuts: Shortcut[];
}

const shortcutGroups: ShortcutGroup[] = [
    {
        group: "Navigation",
        shortcuts: [
            { key: "G D", description: "Go to Dashboard" },
            { key: "G C", description: "Go to Calendar" },
            { key: "G R", description: "Go to Room Management" },
            { key: "G G", description: "Go to Guest Profile" },
            { key: "G B", description: "Go to Billing" },
        ],
    },
    {
        group: "Actions",
        shortcuts: [
            { key: "Cmd + K", description: "Open Command Palette" },
            { key: "N B", description: "New Booking" },
            { key: "/", description: "Search" },
            { key: "?", description: "Show Shortcuts" },
        ],
    },
    {
        group: "Calendar View",
        shortcuts: [
            { key: "T", description: "Go to Today" },
            { key: "W", description: "Week View" },
            { key: "M", description: "Month View" },
            { key: "D", description: "Day View" },
            { key: "L", description: "Toggle Timeline/Resource View" },
        ],
    },
];

export default function ShortcutHelpDialog({ open, onClose }: ShortcutHelpDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={800}>Keyboard Shortcuts</Typography>
                <IconButton onClick={onClose} size="small">
                    <XIcon size={20} />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4}>
                    {shortcutGroups.map((group) => (
                        <Grid size={{ xs: 12, md: 4 }} key={group.group}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 2,
                                    fontWeight: 700,
                                    color: "primary.main",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    fontSize: "11px"
                                }}
                            >
                                {group.group}
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {group.shortcuts.map((shortcut) => (
                                    <Box key={shortcut.key} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {shortcut.description}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            {shortcut.key.split(" ").map((k, i) => (
                                                <Paper
                                                    key={i}
                                                    elevation={0}
                                                    sx={{
                                                        px: 1,
                                                        py: 0.5,
                                                        bgcolor: "action.hover",
                                                        border: "1px solid",
                                                        borderColor: "divider",
                                                        borderRadius: 1,
                                                        minWidth: 24,
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "monospace" }}>
                                                        {k}
                                                    </Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            <Divider sx={{ mt: 3, display: { md: "none" } }} />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
