"use client";

import React from "react";
import { Paper, BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import {
    HomeIcon,
    CalendarIcon,
    Squares2X2Icon,
    UsersIcon,
    PlusIcon,
    TicketIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Check-in", icon: TicketIcon, path: "/checkin" },
    { icon: PlusIcon, path: "/add", isAction: true },
    { label: "Rooms", icon: Squares2X2Icon, path: "/rooms" },
    { label: "Guests", icon: UsersIcon, path: "/guest-profile" },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const getValue = () => {
        const index = navItems.findIndex(item => pathname.startsWith(item.path));
        return index >= 0 ? index : 0;
    };

    return (
        <Paper
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1100,
                display: { xs: "block", md: "none" },
                borderTop: "1px solid",
                borderColor: "divider"
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={getValue()}
                sx={{ height: 64, "& .MuiBottomNavigationAction-root": { minWidth: 0, px: 0 } }}
            >
                {navItems.map((item, index) => (
                    <BottomNavigationAction
                        key={index}
                        label={item.label}
                        icon={
                            item.isAction ? (
                                <Box
                                    sx={{
                                        bgcolor: "primary.main",
                                        color: "white",
                                        p: 1,
                                        borderRadius: "50%",
                                        display: "flex",
                                        boxShadow: "0 4px 10px rgba(59, 130, 246, 0.4)"
                                    }}
                                >
                                    <item.icon className="w-6 h-6" />
                                </Box>
                            ) : (
                                <item.icon className="w-6 h-6" />
                            )
                        }
                        onClick={() => router.push(item.path)}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    );
}
