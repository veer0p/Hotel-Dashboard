"use client";

import React from "react";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { alpha } from "@mui/material/styles";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "alert" | "info" | "success";
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "New Booking",
        message: "Sarah Chen just booked Room 302 for 3 nights.",
        type: "success",
        time: "2m ago",
        read: false,
    },
    {
        id: "2",
        title: "Housekeeping Alert",
        message: "Room 105 requires immediate attention (leak).",
        type: "alert",
        time: "15m ago",
        read: false,
    },
    {
        id: "3",
        title: "System Update",
        message: "PMS will be under maintenance at 02:00 AM.",
        type: "info",
        time: "1h ago",
        read: true,
    },
];

export default function NotificationPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                position: "absolute",
                top: 70,
                right: { xs: 16, sm: 24 },
                width: { xs: "calc(100vw - 32px)", sm: 380 },
                maxHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                zIndex: 1500,
                border: "1px solid",
                borderColor: "divider",
            }}
            role="dialog"
            aria-label="Notifications"
            onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
            }}
        >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "slate.50" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} id="notification-panel-title">
                    Notifications
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        size="small"
                        sx={{ fontSize: 12, fontWeight: 600, textTransform: "none" }}
                        aria-label="Mark all notifications as read"
                    >
                        Mark all as read
                    </Button>
                    <IconButton size="small" onClick={onClose} aria-label="Close notifications">
                        <XMarkIcon className="w-5 h-5 text-slate-500" />
                    </IconButton>
                </Box>
            </Box>

            <Divider />

            <List sx={{ overflowY: "auto", flexGrow: 1, py: 0 }} aria-labelledby="notification-panel-title">
                {mockNotifications.map((notif) => (
                    <React.Fragment key={notif.id}>
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                px: 2,
                                py: 2,
                                bgcolor: notif.read ? "transparent" : alpha("#3B82F6", 0.03),
                                "&:hover": { bgcolor: "action.hover" },
                                cursor: "pointer",
                            }}
                            component="div"
                            role="button"
                            tabIndex={0}
                            aria-label={`${notif.title}: ${notif.message}. Received ${notif.time}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    console.log(`Notification ${notif.id} clicked`);
                                }
                            }}
                        >
                            <Box sx={{ mr: 2, mt: 0.5 }}>
                                {notif.type === "success" && <CheckCircleIcon className="w-5 h-5 text-emerald-500" />}
                                {notif.type === "alert" && <ExclamationCircleIcon className="w-5 h-5 text-rose-500" />}
                                {notif.type === "info" && <InformationCircleIcon className="w-5 h-5 text-blue-500" />}
                            </Box>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>
                                            {notif.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                            {notif.time}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13, mt: 0.5, lineHeight: 1.4 }}>
                                        {notif.message}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>

            <Box sx={{ p: 1.5, textAlign: "center", borderTop: "1px solid", borderColor: "divider" }}>
                <Button
                    fullWidth
                    size="small"
                    endIcon={<TrashIcon className="w-4 h-4" />}
                    sx={{ color: "text.secondary", textTransform: "none", fontWeight: 600 }}
                    aria-label="Clear all notifications"
                >
                    Clear all notifications
                </Button>
            </Box>
        </Paper>
    );
}
