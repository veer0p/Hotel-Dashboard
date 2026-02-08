"use client";

import React, { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    HomeIcon,
    CalendarIcon,
    Squares2X2Icon,
    UsersIcon,
    TicketIcon,
    BanknotesIcon,
    Cog6ToothIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeIconSolid,
    CalendarIcon as CalendarIconSolid,
    Squares2X2Icon as Squares2X2IconSolid,
    UsersIcon as UsersIconSolid,
    TicketIcon as TicketIconSolid,
    BanknotesIcon as BanknotesIconSolid,
} from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { useUIState } from "@/lib/ui-state-context";

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;

const menuItems = [
    { text: "Dashboard", icon: HomeIcon, solidIcon: HomeIconSolid, path: "/" },
    { text: "Calendar", icon: CalendarIcon, solidIcon: CalendarIconSolid, path: "/calendar" },
    { text: "Rooms", icon: Squares2X2Icon, solidIcon: Squares2X2IconSolid, path: "/rooms" },
    { text: "Guests", icon: UsersIcon, solidIcon: UsersIconSolid, path: "/guest-profile" },
    { text: "Check-in", icon: TicketIcon, solidIcon: TicketIconSolid, path: "/checkin" },
    { text: "Billing", icon: BanknotesIcon, solidIcon: BanknotesIconSolid, path: "/billing" },
];

export default function SidebarRail() {
    const [isHovered, setIsHovered] = useState(false);
    const { isSidebarExpanded } = useUIState();
    const pathname = usePathname();
    const router = useRouter();
    const theme = useTheme();

    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const isActuallyExpanded = (isHovered || isSidebarExpanded) && isDesktop;

    return (
        <Box
            component="nav"
            aria-label="Main Navigation Rail"
            onMouseEnter={() => isDesktop && setIsHovered(true)}
            onMouseLeave={() => isDesktop && setIsHovered(false)}
            sx={{
                width: isActuallyExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                zIndex: 1200,
                transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "4px 0 10px -3px rgba(0,0,0,0.05)",
                overflowX: "hidden",
            }}
        >
            <Box sx={{ height: 64, display: "flex", alignItems: "center", px: 2.5 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.main",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                    role="img"
                    aria-label="Hotel PMS Logo"
                >
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 900, fontSize: 18 }}>
                        H
                    </Typography>
                </Box>
                {isActuallyExpanded && (
                    <Typography
                        variant="h6"
                        sx={{
                            ml: 2,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        Hotel PMS
                    </Typography>
                )}
            </Box>

            <Divider aria-hidden="true" />

            <List sx={{ px: 1.5, py: 2 }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                    const Icon = isActive ? item.solidIcon : item.icon;

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <Tooltip title={!isActuallyExpanded ? item.text : ""} placement="right">
                                <ListItemButton
                                    onClick={() => router.push(item.path)}
                                    aria-current={isActive ? "page" : undefined}
                                    sx={{
                                        minHeight: 48,
                                        px: 1,
                                        borderRadius: 2,
                                        justifyContent: isActuallyExpanded ? "initial" : "center",
                                        bgcolor: isActive ? "primary.lighter" : "transparent",
                                        color: isActive ? "primary.main" : "text.secondary",
                                        "&:hover": {
                                            bgcolor: isActive ? "primary.lighter" : "action.hover",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isActuallyExpanded ? 2 : 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        <Icon className="w-6 h-6" aria-hidden="true" />
                                    </ListItemIcon>
                                    {isActuallyExpanded && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: isActive ? 600 : 500,
                                                whiteSpace: "nowrap",
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ mt: "auto", px: 1.5, pb: 2 }}>
                <Divider sx={{ mb: 2 }} aria-hidden="true" />
                <Tooltip title={!isActuallyExpanded ? "Quick Add" : ""} placement="right">
                    <ListItemButton
                        aria-label="Quick Add Action"
                        sx={{
                            minHeight: 48,
                            px: 1,
                            borderRadius: 2,
                            justifyContent: isActuallyExpanded ? "initial" : "center",
                            bgcolor: "primary.main",
                            color: "white",
                            "&:hover": {
                                bgcolor: "primary.dark",
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isActuallyExpanded ? 2 : 0,
                                justifyContent: "center",
                                color: "inherit",
                            }}
                        >
                            <PlusIcon className="w-6 h-6" aria-hidden="true" />
                        </ListItemIcon>
                        {isActuallyExpanded && (
                            <ListItemText
                                primary="Quick Add"
                                primaryTypographyProps={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            />
                        )}
                    </ListItemButton>
                </Tooltip>

                <ListItemButton
                    aria-label="Settings"
                    sx={{
                        minHeight: 48,
                        px: 1,
                        borderRadius: 2,
                        mt: 1,
                        justifyContent: isActuallyExpanded ? "initial" : "center",
                        color: "text.secondary",
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: isActuallyExpanded ? 2 : 0,
                            justifyContent: "center",
                            color: "inherit",
                        }}
                    >
                        <Cog6ToothIcon className="w-6 h-6" aria-hidden="true" />
                    </ListItemIcon>
                    {isActuallyExpanded && (
                        <ListItemText
                            primary="Settings"
                            primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                            }}
                        />
                    )}
                </ListItemButton>
            </Box>
        </Box>
    );
}

// Simple Typography import fix if needed
import { Typography } from "@mui/material";
