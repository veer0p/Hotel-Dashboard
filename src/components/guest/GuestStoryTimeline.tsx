"use client";

import { Typography, Box, Paper, Button, TextField, InputAdornment, Avatar, Chip, Stack, alpha } from "@mui/material";
import { Guest, GuestEvent } from "@/data/mockGuestData";
import { Bed, MessageSquare, Star, Milestone, Calendar, Plus } from "lucide-react";

interface GuestStoryTimelineProps {
    timeline: GuestEvent[];
}

const getEventIcon = (type: GuestEvent['type']) => {
    switch (type) {
        case 'stay': return <Bed size={18} />;
        case 'comm': return <MessageSquare size={18} />;
        case 'review': return <Star size={18} />;
        case 'milestone': return <Milestone size={18} />;
        default: return <Calendar size={18} />;
    }
};

const getEventColor = (type: GuestEvent['type']) => {
    switch (type) {
        case 'stay': return '#3B82F6';
        case 'comm': return '#10B981';
        case 'review': return '#F59E0B';
        case 'milestone': return '#8B5CF6';
        default: return '#6B7280';
    }
};

export function GuestStoryTimeline({ timeline }: GuestStoryTimelineProps) {
    return (
        <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Guest Story Timeline</Typography>
                <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                    <Plus size={16} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Add Event</Typography>
                </Box>
            </Box>

            <Box sx={{ position: 'relative', ml: 2 }}>
                {/* Timeline Line */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 20,
                        bottom: 0,
                        width: '2px',
                        bgcolor: 'divider'
                    }}
                />

                <Stack spacing={4}>
                    {timeline.map((event, index) => (
                        <Box key={event.id} sx={{ position: 'relative', pl: 5 }}>
                            {/* Timeline Marker */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: -18,
                                    top: 0,
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    bgcolor: 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid',
                                    borderColor: getEventColor(event.type),
                                    color: getEventColor(event.type),
                                    zIndex: 1
                                }}
                            >
                                {getEventIcon(event.type)}
                            </Box>

                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: alpha(getEventColor(event.type), 0.02) }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{event.date}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{event.description}</Typography>

                                {event.room && (
                                    <Chip label={`Room ${event.room}`} size="small" sx={{ mr: 1, height: 24, fontSize: '0.75rem' }} />
                                )}
                                {event.amount && (
                                    <Chip label={`$${event.amount}`} size="small" variant="outlined" sx={{ height: 24, fontSize: '0.75rem' }} />
                                )}

                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>View Details</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', fontWeight: 600 }}>Duplicate</Typography>
                                </Box>
                            </Paper>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}
