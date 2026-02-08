"use client";

import { Box, Paper, Typography, Chip } from "@mui/material";
import { RoomStatus } from "@/data/mockFloorPlanData";
import { memo } from "react";

interface StatusLegendProps {
    stats: {
        total: number;
        occupied: number;
        vacant: number;
        dirty: number;
        maintenance: number;
        occupancyRate: string;
    };
    selectedFilter: RoomStatus | 'all';
    onFilterChange: (filter: RoomStatus | 'all') => void;
}

const statusItems = [
    { status: 'vacant' as RoomStatus, color: '#10B981', label: 'Vacant' },
    { status: 'occupied' as RoomStatus, color: '#8B5CF6', label: 'Occupied' },
    { status: 'dirty' as RoomStatus, color: '#F59E0B', label: 'Dirty' },
    { status: 'maintenance' as RoomStatus, color: '#EF4444', label: 'Maintenance' },
];

const StatusLegendComponent = ({ stats, selectedFilter, onFilterChange }: StatusLegendProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                height: 'fit-content',
                position: 'sticky',
                top: 16,
            }}
        >
            {/* Total Stats */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Total Rooms
                </Typography>
            </Box>

            {/* Occupancy Rate */}
            <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                    {stats.occupancyRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Occupancy Rate
                </Typography>
            </Box>

            {/* Status Filters */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Filter by Status
            </Typography>

            {/* All Filter */}
            <Box
                onClick={() => onFilterChange('all')}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    bgcolor: selectedFilter === 'all' ? 'action.selected' : 'transparent',
                    border: '1px solid',
                    borderColor: selectedFilter === 'all' ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
            >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    All Rooms
                </Typography>
                <Chip
                    label={stats.total}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        minWidth: 32,
                        height: 24,
                    }}
                />
            </Box>

            {/* Status Filters */}
            {statusItems.map((item) => {
                const count = stats[item.status];
                return (
                    <Box
                        key={item.status}
                        onClick={() => onFilterChange(item.status)}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            mb: 1,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            bgcolor: selectedFilter === item.status ? 'action.selected' : 'transparent',
                            border: '1px solid',
                            borderColor: selectedFilter === item.status ? 'primary.main' : 'transparent',
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.label}
                            </Typography>
                        </Box>
                        <Chip
                            label={count}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                minWidth: 32,
                                height: 24,
                                bgcolor: item.color,
                                color: '#ffffff',
                            }}
                        />
                    </Box>
                );
            })}
        </Paper>
    );
};

export const StatusLegend = memo(StatusLegendComponent);
