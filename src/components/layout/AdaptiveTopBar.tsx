"use client";

import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    InputBase,
    IconButton,
    Avatar,
    Badge,
    Typography,
    Chip,
    Menu,
    MenuItem,
    Button,
    Divider,
} from "@mui/material";
import {
    MagnifyingGlassIcon,
    BellIcon,
    UserCircleIcon,
    ChevronDownIcon,
    ClockIcon,
    Bars3Icon,
    MoonIcon,
    SunIcon,
    ArrowRightOnRectangleIcon,
    UserIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { styled, alpha } from "@mui/material/styles";
import { useUIState } from "@/lib/ui-state-context";
import NotificationPanel from "@/components/layout/NotificationPanel";

const SearchWrapper = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    backgroundColor: alpha(theme.palette.action.active, 0.04),
    "&:hover": {
        backgroundColor: alpha(theme.palette.action.active, 0.08),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    border: "1px solid",
    borderColor: alpha(theme.palette.divider, 0.1),
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
        minWidth: 400,
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        fontSize: 14,
        fontWeight: 500,
    },
}));

const ShortcutBadge = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0.2, 0.8),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.action.active, 0.08),
    color: theme.palette.text.secondary,
    fontSize: 11,
    fontWeight: 600,
    marginRight: theme.spacing(1.5),
    border: "1px solid",
    borderColor: alpha(theme.palette.divider, 0.1),
}));

import { useAuth } from "@/hooks/useAuth";

export default function AdaptiveTopBar() {
    const {
        property,
        setProperty,
        setIsDrawerOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        themeMode,
        setThemeMode
    } = useUIState();

    const { user, signOut } = useAuth();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [propertyAnchorEl, setPropertyAnchorEl] = useState<null | HTMLElement>(null);
    const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handlePropertyOpen = (event: React.MouseEvent<HTMLElement>) => {
        setPropertyAnchorEl(event.currentTarget);
    };

    const handlePropertyClose = (prop?: string) => {
        if (typeof prop === "string") setProperty(prop);
        setPropertyAnchorEl(null);
    };

    const handleUserOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserClose = () => {
        setUserAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut();
        handleUserClose();
    };

    const getShift = () => {
        const hour = currentTime.getHours();
        if (hour >= 6 && hour < 14) return { label: "Morning Shift", color: "#F59E0B" };
        if (hour >= 14 && hour < 22) return { label: "Afternoon Shift", color: "#3B82F6" };
        return { label: "Night Shift", color: "#8B5CF6" };
    };

    const shift = getShift();

    // Get user display name or email
    const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
    const userRole = user?.user_metadata?.role || "Account Holder";

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "background.paper",
                color: "text.primary",
                borderBottom: "1px solid",
                borderColor: "divider",
                zIndex: 1100,
                height: 64,
                justifyContent: "center",
            }}
        >
            <Toolbar sx={{ px: { xs: 2, sm: 3 }, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                        color="inherit"
                        aria-label="Toggle navigation drawer"
                        edge="start"
                        onClick={() => setIsDrawerOpen(true)}
                        sx={{
                            mr: 1,
                            display: { lg: "none" },
                            width: 48,
                            height: 48
                        }}
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </IconButton>
                    <SearchWrapper role="search">
                        <SearchIconWrapper>
                            <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search reservations, rooms, guests..."
                            inputProps={{
                                "aria-label": "Search across Reservations, Rooms, and Guests",
                                "type": "search"
                            }}
                        />
                        <ShortcutBadge aria-hidden="true">⌘ K</ShortcutBadge>
                    </SearchWrapper>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2.5 } }}>
                    <Box
                        sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1, color: "text.secondary" }}
                        role="timer"
                        aria-label="Current shift time"
                    >
                        <ClockIcon className="w-4 h-4" aria-hidden="true" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Chip
                            label={shift.label}
                            size="small"
                            sx={{
                                ml: 1,
                                height: 24,
                                fontSize: 11,
                                fontWeight: 600,
                                bgcolor: alpha(shift.color, 0.1),
                                color: shift.color,
                                border: "1px solid",
                                borderColor: alpha(shift.color, 0.2),
                            }}
                        />
                    </Box>

                    <Button
                        onClick={handlePropertyOpen}
                        endIcon={<ChevronDownIcon className="w-4 h-4" aria-hidden="true" />}
                        aria-haspopup="true"
                        aria-expanded={Boolean(propertyAnchorEl)}
                        aria-label={`Current property: ${property}. Click to switch property.`}
                        sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: 14,
                            textTransform: "none",
                            display: { xs: "none", sm: "flex" },
                            minHeight: 48,
                            px: 2,
                        }}
                    >
                        {property}
                    </Button>
                    <Menu
                        anchorEl={propertyAnchorEl}
                        open={Boolean(propertyAnchorEl)}
                        onClose={() => handlePropertyClose()}
                        PaperProps={{
                            elevation: 4,
                            sx: { mt: 1, minWidth: 200, borderRadius: 2 }
                        }}
                        aria-label="Property selection menu"
                    >
                        <MenuItem onClick={() => handlePropertyClose("Main Hotel")}>Main Hotel</MenuItem>
                        <MenuItem onClick={() => handlePropertyClose("Beach Resort")}>Beach Resort</MenuItem>
                        <MenuItem onClick={() => handlePropertyClose("Urban Suites")}>Urban Suites</MenuItem>
                    </Menu>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                            size="large"
                            sx={{ width: 48, height: 48 }}
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            aria-label={`Notifications - 3 unread`}
                            aria-haspopup="dialog"
                            aria-expanded={isNotificationsOpen}
                        >
                            <Badge badgeContent={3} color="error" sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}>
                                <BellIcon className={`w-6 h-6 ${isNotificationsOpen ? "text-primary-main" : "text-slate-600"}`} aria-hidden="true" />
                            </Badge>
                        </IconButton>

                        <NotificationPanel
                            isOpen={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                ml: 1,
                                gap: 1.5,
                                pl: 1.5,
                                borderLeft: "1px solid",
                                borderColor: alpha("#000", 0.05),
                                cursor: "pointer"
                            }}
                            onClick={handleUserOpen}
                            role="button"
                            aria-haspopup="true"
                            aria-expanded={Boolean(userAnchorEl)}
                            aria-label="User account menu"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") handleUserOpen(e as unknown as React.MouseEvent<HTMLElement>);
                            }}
                        >
                            <Box sx={{ textAlign: "right", display: { xs: "none", lg: "block" } }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}>
                                    {userDisplayName}
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary" }}>
                                    {userRole}
                                </Typography>
                            </Box>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: "primary.main",
                                    boxShadow: "0 0 0 2px white, 0 0 0 4px rgba(59, 130, 246, 0.1)",
                                }}
                            >
                                <UserCircleIcon className="w-full h-full" aria-hidden="true" />
                            </Avatar>
                        </Box>

                        <Menu
                            anchorEl={userAnchorEl}
                            open={Boolean(userAnchorEl)}
                            onClose={handleUserClose}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            PaperProps={{
                                elevation: 4,
                                sx: { mt: 1.5, minWidth: 220, borderRadius: 2 }
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{userDisplayName}</Typography>
                                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                            </Box>
                            <Divider />
                            <MenuItem onClick={handleUserClose} sx={{ py: 1.2, gap: 1.5 }}>
                                <UserIcon className="w-5 h-5 text-slate-400" />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleUserClose} sx={{ py: 1.2, gap: 1.5 }}>
                                <Cog6ToothIcon className="w-5 h-5 text-slate-400" />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>Settings</Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    setThemeMode(themeMode === "light" ? "dark" : "light");
                                    handleUserClose();
                                }}
                                sx={{ py: 1.2, gap: 1.5 }}
                            >
                                {themeMode === "light" ? (
                                    <MoonIcon className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <SunIcon className="w-5 h-5 text-slate-400" />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {themeMode === "light" ? "Dark Mode" : "Light Mode"}
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1.5, color: "error.main" }}>
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
