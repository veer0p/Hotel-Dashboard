"use client";

import { Box, Button, ButtonGroup, IconButton, Typography, Menu, MenuItem, Chip } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { CalendarViewMode, CalendarFilters } from "@/lib/hooks/useCalendarState";
import { format } from "date-fns";
import { useState } from "react";

interface CalendarHeaderProps {
    viewMode: CalendarViewMode;
    onViewModeChange: (mode: CalendarViewMode) => void;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    filters: CalendarFilters;
    onFiltersChange: (filters: CalendarFilters) => void;
    onNewBooking: () => void;
    selectionMode: "single" | "multiple";
    onToggleSelectionMode: () => void;
}

export default function CalendarHeader({
    viewMode,
    onViewModeChange,
    selectedDate,
    onDateChange,
    filters,
    onFiltersChange,
    onNewBooking,
    selectionMode,
    onToggleSelectionMode
}: CalendarHeaderProps) {
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

    const getDateLabel = () => {
        switch (viewMode) {
            case "day":
                return format(selectedDate, "MMMM d, yyyy");
            case "week":
                return `Week of ${format(selectedDate, "MMM d, yyyy")}`;
            case "month":
                return format(selectedDate, "MMMM yyyy");
            case "resources":
                return `Resources • ${format(selectedDate, "MMM d, yyyy")}`;
        }
    };

    const navigateDate = (direction: "prev" | "next" | "today") => {
        const increment = direction === "next" ? 1 : direction === "prev" ? -1 : 0;
        const newDate = new Date(selectedDate);

        if (direction === "today") {
            onDateChange(new Date());
            return;
        }

        switch (viewMode) {
            case "day":
                newDate.setDate(newDate.getDate() + increment);
                break;
            case "week":
            case "resources":
                newDate.setDate(newDate.getDate() + (increment * 7));
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() + increment);
                break;
        }

        onDateChange(newDate);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            {/* Left: View Mode Toggle */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}>
                    Calendar
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                    <Button
                        onClick={() => onViewModeChange("day")}
                        variant={viewMode === "day" ? "contained" : "outlined"}
                    >
                        Day
                    </Button>
                    <Button
                        onClick={() => onViewModeChange("week")}
                        variant={viewMode === "week" ? "contained" : "outlined"}
                    >
                        Week
                    </Button>
                    <Button
                        onClick={() => onViewModeChange("month")}
                        variant={viewMode === "month" ? "contained" : "outlined"}
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        Month
                    </Button>
                    <Button
                        onClick={() => onViewModeChange("resources")}
                        variant={viewMode === "resources" ? "contained" : "outlined"}
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        Resources
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Center: Date Navigation */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => navigateDate("prev")} aria-label="Previous">
                    <ChevronLeftIcon className="w-5 h-5" />
                </IconButton>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigateDate("today")}
                    sx={{ minWidth: 200, fontWeight: 600 }}
                >
                    {getDateLabel()}
                </Button>
                <IconButton size="small" onClick={() => navigateDate("next")} aria-label="Next">
                    <ChevronRightIcon className="w-5 h-5" />
                </IconButton>
            </Box>

            {/* Right: Actions & Filters */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    variant={selectionMode === "multiple" ? "contained" : "outlined"}
                    size="small"
                    color={selectionMode === "multiple" ? "secondary" : "inherit"}
                    onClick={onToggleSelectionMode}
                    sx={{ px: 2, fontWeight: 600 }}
                >
                    {selectionMode === "multiple" ? "Cancel Selection" : "Bulk Select"}
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => onNewBooking()}
                    sx={{ px: 2, fontWeight: 600 }}
                >
                    New Booking
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FunnelIcon className="w-4 h-4" />}
                    onClick={(e) => setFilterAnchor(e.currentTarget)}
                    endIcon={activeFilterCount > 0 ? <Chip label={activeFilterCount} size="small" color="primary" /> : null}
                >
                    Filters
                </Button>
                <Menu
                    anchorEl={filterAnchor}
                    open={Boolean(filterAnchor)}
                    onClose={() => setFilterAnchor(null)}
                >
                    <MenuItem onClick={() => { onFiltersChange({ ...filters, status: "confirmed" }); setFilterAnchor(null); }}>
                        Confirmed Only
                    </MenuItem>
                    <MenuItem onClick={() => { onFiltersChange({ ...filters, status: "checked-in" }); setFilterAnchor(null); }}>
                        Checked-in Only
                    </MenuItem>
                    <MenuItem onClick={() => { onFiltersChange({}); setFilterAnchor(null); }}>
                        Clear Filters
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}
