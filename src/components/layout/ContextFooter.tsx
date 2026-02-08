"use client";

import React from "react";
import { Box, Typography, Button, Paper, Stack, IconButton, alpha } from "@mui/material";
import {
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    PlusCircleIcon,
    EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";
import { useUIState } from "@/lib/ui-state-context";

export default function ContextFooter() {
    const { activeContext, setActiveContext } = useUIState();

    if (!activeContext) return null;

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                minWidth: { xs: "90%", md: 600 },
                bgcolor: "#0f172a", // Dark gray-900 style
                color: "white",
                borderRadius: 3,
                px: 3,
                py: 1.5,
                zIndex: 1300,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: alpha("#fff", 0.1),
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            <Stack direction="row" spacing={3} alignItems="center">
                <Box>
                    <Typography variant="caption" sx={{ color: alpha("#fff", 0.6), fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Selected Context
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {activeContext || "Sarah Chen • Room 202 • $450"}
                    </Typography>
                </Box>

                <Box sx={{ height: 32, width: 1, bgcolor: alpha("#fff", 0.1), mr: 1 }} />

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleIcon className="w-4 h-4" />}
                        sx={{ bgcolor: "primary.main", color: "white", fontWeight: 700, textTransform: "none", borderRadius: 1.5 }}
                    >
                        Check-in
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<ChatBubbleLeftRightIcon className="w-4 h-4" />}
                        sx={{ color: "white", fontWeight: 600, textTransform: "none", borderRadius: 1.5, "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                    >
                        Message
                    </Button>
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<PlusCircleIcon className="w-4 h-4" />}
                        sx={{ color: "white", fontWeight: 600, textTransform: "none", borderRadius: 1.5, "&:hover": { bgcolor: alpha("#fff", 0.1) } }}
                    >
                        Add Charge
                    </Button>
                </Stack>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" sx={{ color: alpha("#fff", 0.6) }}>
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => setActiveContext(null)}
                    sx={{ color: alpha("#fff", 0.6), "&:hover": { color: "white", bgcolor: alpha("#fff", 0.1) } }}
                >
                    <XMarkIcon className="w-5 h-5" />
                </IconButton>
            </Stack>
        </Paper>
    );
}
