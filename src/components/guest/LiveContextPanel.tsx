"use client";

import { Box, Paper, Typography, Stack, Button, Chip } from "@mui/material";
import { Guest } from "@/data/mockGuestData";
import { Sparkles, Calendar, Gift, Coffee, ArrowRight } from "lucide-react";

interface LiveContextPanelProps {
    guest: Guest;
}

export function LiveContextPanel({ guest }: LiveContextPanelProps) {
    return (
        <Stack spacing={3}>
            {/* Current Context Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: '#EFF6FF',
                    border: '1px solid',
                    borderColor: '#DBEAFE'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Calendar size={20} color="#2563EB" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E40AF' }}>
                        Current Context
                    </Typography>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1E3A8A' }}>
                    {guest.currentContext.status}
                </Typography>
                <Typography variant="body2" sx={{ color: '#3B82F6', mb: 2, fontWeight: 500 }}>
                    {guest.currentContext.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#DBEAFE', borderRadius: 2 }}>
                    <Gift size={16} color="#1E40AF" />
                    <Typography variant="caption" sx={{ color: '#1E40AF', fontWeight: 700 }}>
                        {guest.currentContext.nextMilestone}
                    </Typography>
                </Box>
            </Paper>

            {/* Smart Suggestions */}
            <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Sparkles size={18} color="#8B5CF6" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Smart Suggestions
                    </Typography>
                </Box>

                <Stack spacing={1.5}>
                    {guest.currentContext.suggestions.map((suggestion, idx) => (
                        <Paper
                            key={idx}
                            elevation={0}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {suggestion}
                            </Typography>
                        </Paper>
                    ))}
                </Stack>
            </Box>

            {/* Quick Actions */}
            <Box sx={{ px: 1, mt: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
                    Quick Actions
                </Typography>
                <Stack spacing={1}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ borderRadius: 2, textTransform: 'none', py: 1.2, fontWeight: 700 }}
                    >
                        Send Welcome
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ borderRadius: 2, textTransform: 'none', py: 1.2, fontWeight: 700 }}
                    >
                        Add Amenity
                    </Button>
                    <Button
                        variant="text"
                        fullWidth
                        endIcon={<ArrowRight size={16} />}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Create Future Booking
                    </Button>
                </Stack>
            </Box>
        </Stack>
    );
}
