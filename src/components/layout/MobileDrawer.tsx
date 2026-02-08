"use client";

import React from "react";
import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    IconButton,
} from "@mui/material";
import {
    HomeIcon,
    CalendarIcon,
    Squares2X2Icon,
    UsersIcon,
    TicketIcon,
    BanknotesIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useUIState } from "@/lib/ui-state-context";

const menuItems = [
    { text: "Dashboard", icon: HomeIcon, path: "/" },
    { text: "Calendar", icon: CalendarIcon, path: "/calendar" },
    { text: "Rooms", icon: Squares2X2Icon, path: "/rooms" },
    { text: "Guests", icon: UsersIcon, path: "/guest-profile" },
    { text: "Check-in", icon: TicketIcon, path: "/checkin" },
    { text: "Billing", icon: BanknotesIcon, path: "/billing" },
];

export default function MobileDrawer() {
    const { isDrawerOpen, setIsDrawerOpen } = useUIState();
    const pathname = usePathname();
    const router = useRouter();

    const handleClose = () => setIsDrawerOpen(false);

    const handleNavigation = (path: string) => {
        router.push(path);
        handleClose();
    };

    return (
        <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 280,
                    bgcolor: "background.paper",
                    backgroundImage: "none",
                },
            }}
            ModalProps={{
                slotProps: {
                    backdrop: {
                        sx: {
                            backdropFilter: "blur(4px)",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                        },
                    },
                },
            }}
        >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "white", fontWeight: 900, fontSize: 18 }}>
                            H
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Hotel PMS
                    </Typography>
                </Box>
                <IconButton onClick={handleClose}>
                    <XMarkIcon className="w-6 h-6 text-slate-500" />
                </IconButton>
            </Box>

            <Divider />

            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    minHeight: 48,
                                    bgcolor: isActive ? "primary.lighter" : "transparent",
                                    color: isActive ? "primary.main" : "text.secondary",
                                    "&:hover": {
                                        bgcolor: isActive ? "primary.lighter" : "action.hover",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                                    <item.icon className="w-6 h-6" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 15,
                                        fontWeight: isActive ? 600 : 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
}
