"use client";

import { Box, Paper, Typography, Stack, alpha, Chip, Badge } from "@mui/material";
import { FolioCharge } from "@/data/mockFolioData";
import { Bed, Coffee, Wine, Sparkles, User, Clock, Activity } from "lucide-react";

interface FolioTimelineProps {
    charges: FolioCharge[];
}

const getCategoryIcon = (category: FolioCharge['category']) => {
    switch (category) {
        case 'room': return <Bed size={16} />;
        case 'food': return <Coffee size={16} />;
        case 'bar': return <Wine size={16} />;
        default: return <Sparkles size={16} />;
    }
};

const getCategoryColor = (category: FolioCharge['category']) => {
    switch (category) {
        case 'room': return '#3B82F6';
        case 'food': return '#10B981';
        case 'bar': return '#F59E0B';
        case 'spa': return '#8B5CF6';
        default: return '#6B7280';
    }
};

export function FolioTimeline({ charges }: FolioTimelineProps) {
    // Group charges by date
    const groupedCharges = charges.reduce((acc, charge) => {
        if (!acc[charge.date]) acc[charge.date] = [];
        acc[charge.date].push(charge);
        return acc;
    }, {} as Record<string, FolioCharge[]>);

    return (
        <Box sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Living Folio</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Real-time" size="small" sx={{ bgcolor: alpha('#10B981', 0.1), color: '#10B981', fontWeight: 800, border: 'none' }} icon={<Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', ml: 1 }} />} />
                    <Chip label="Audited" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                </Box>
            </Box>

            <Stack spacing={4}>
                {Object.entries(groupedCharges).map(([date, dayCharges]) => (
                    <Box key={date}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography variant="overline" sx={{ fontWeight: 900, fontSize: '0.75rem', color: 'text.secondary', letterSpacing: 1.5 }}>
                                {date}
                            </Typography>
                            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
                        </Box>

                        <Stack spacing={2}>
                            {dayCharges.map((charge) => (
                                <Paper
                                    key={charge.id}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: charge.isNew ? 'primary.main' : 'divider',
                                        borderRadius: 3,
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    {charge.isNew && (
                                        <Box sx={{ position: 'absolute', top: -5, left: -5, width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%', border: '2px solid white', boxShadow: 2, animation: 'pulse 2s infinite' }} />
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{
                                                p: 1.2,
                                                bgcolor: `${getCategoryColor(charge.category)}10`,
                                                color: getCategoryColor(charge.category),
                                                borderRadius: 2,
                                                height: 'fit-content'
                                            }}>
                                                {getCategoryIcon(charge.category)}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>{charge.description}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Clock size={12} color="#94A3B8" />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{charge.time}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <User size={12} color="#94A3B8" />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{charge.staff}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>${charge.amount}</Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>

            <Box sx={{ mt: 6, p: 3, border: '2px dashed', borderColor: 'divider', borderRadius: 4, textAlign: 'center', bgcolor: alpha('#F8FAFC', 0.5) }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    [ Waiting for real-time charges... ]
                </Typography>
            </Box>
        </Box>
    );
}
