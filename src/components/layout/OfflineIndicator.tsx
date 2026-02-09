"use client";

import React, { useEffect, useState } from "react";
import { Box, Paper, Typography, Fade } from "@mui/material";
import { WifiIcon, SignalSlashIcon } from "@heroicons/react/24/outline";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useAnnouncer } from "@/lib/hooks/useAnnouncer";

export default function OfflineIndicator() {
    const isOnline = useOnlineStatus();
    const { announce } = useAnnouncer();
    const [showOnlineMessage, setShowOnlineMessage] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
            announce("You are currently offline. Some features may be unavailable.", "assertive");
        } else if (wasOffline) {
            setShowOnlineMessage(true);
            announce("Connection restored. You are back online.", "polite");
            setWasOffline(false);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setShowOnlineMessage(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, announce, wasOffline]);

    if (isOnline && !showOnlineMessage) return null;

    return (
        <Fade in={!isOnline || showOnlineMessage}>
            <Paper
                elevation={8}
                sx={{
                    position: "fixed",
                    bottom: { xs: 80, sm: 24 },
                    right: 24,
                    zIndex: 2000,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2.5,
                    py: 1.5,
                    bgcolor: isOnline ? "success.main" : "warning.main",
                    color: "white",
                    borderRadius: 2,
                    minWidth: 200,
                }}
                role="status"
                aria-live="polite"
            >
                {isOnline ? (
                    <WifiIcon className="w-5 h-5" />
                ) : (
                    <SignalSlashIcon className="w-5 h-5" />
                )}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isOnline ? "Back online" : "You're offline"}
                </Typography>
            </Paper>
        </Fade>
    );
}
