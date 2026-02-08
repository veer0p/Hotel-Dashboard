"use client";

import { Box, Paper, Typography, Grid, Stack, Tooltip, IconButton, Badge } from "@mui/material";
import { GuestPreference } from "@/data/mockGuestData";
import {
    VolumeX,
    Building2,
    Wifi,
    Coffee,
    Moon,
    Sun,
    Thermometer,
    Wind,
    Star,
    MoreVertical,
    ChevronUp
} from "lucide-react";

interface PreferenceVisualizerProps {
    preferences: GuestPreference[];
}

const getPrefIcon = (iconName: string) => {
    switch (iconName) {
        case 'VolumeX': return <VolumeX size={24} />;
        case 'Building2': return <Building2 size={24} />;
        case 'Wifi': return <Wifi size={24} />;
        case 'Coffee': return <Coffee size={24} />;
        case 'Moon': return <Moon size={24} />;
        case 'Sun': return <Sun size={24} />;
        case 'Thermometer': return <Thermometer size={24} />;
        case 'Wind': return <Wind size={24} />;
        default: return <Star size={24} />;
    }
};

const getCategoryColor = (category: GuestPreference['category']) => {
    switch (category) {
        case 'Room': return '#3B82F6';
        case 'Amenity': return '#10B981';
        case 'Service': return '#8B5CF6';
        default: return '#6B7280';
    }
};

export function PreferenceVisualizer({ preferences }: PreferenceVisualizerProps) {
    // Sort by priority (high first)
    const sortedPrefs = [...preferences].sort((a, b) =>
        a.priority === 'high' ? -1 : 1
    );

    return (
        <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
                    Visual Preferences
                </Typography>
                <IconButton size="small"><MoreVertical size={16} /></IconButton>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 2 }}>
                {sortedPrefs.map((pref) => (
                    <Tooltip key={pref.id} title={`${pref.category}: ${pref.label}`} arrow>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                position: 'relative',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: getCategoryColor(pref.category),
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${getCategoryColor(pref.category)}20`
                                }
                            }}
                        >
                            {pref.priority === 'high' && (
                                <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                                </Box>
                            )}

                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2.5,
                                    bgcolor: `${getCategoryColor(pref.category)}10`,
                                    color: getCategoryColor(pref.category),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {getPrefIcon(pref.icon)}
                            </Box>

                            <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center' }}>
                                {pref.label}
                            </Typography>
                        </Paper>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
}
