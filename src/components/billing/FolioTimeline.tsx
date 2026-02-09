"use client";

import { Box, Paper, Typography, Stack, alpha, Chip, Badge } from "@mui/material";
import { FolioCharge } from "@/data/mockFolioData";
import { Bed, Coffee, Wine, Sparkles, User, Clock, Activity, Zap } from "lucide-react";

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
                    <Chip
                        label="Live Updates"
                        size="small"
                        sx={{
                            bgcolor: alpha('#10B981', 0.1),
                            color: '#10B981',
                            fontWeight: 800,
                            border: 'none',
                            '& .MuiChip-icon': { color: 'inherit' }
                        }}
                        icon={<Activity size={12} />}
                    />
                    <Chip label="Audited" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                </Box>
            </Box>

            <Stack spacing={5} sx={{ position: 'relative' }}>
                {/* Vertical Timeline Line */}
                <Box sx={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    bottom: 0,
                    width: 2,
                    bgcolor: 'divider',
                    zIndex: 0
                }} />

                {Object.entries(groupedCharges).map(([date, dayCharges]) => (
                    <Box key={date} sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                                width: 42,
                                height: 24,
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: -0.5
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary' }}>
                                    {date.split(' ')[1]}
                                </Typography>
                            </Box>
                            <Typography variant="overline" sx={{ fontWeight: 900, fontSize: '0.75rem', color: 'text.primary', letterSpacing: 1.5 }}>
                                {date} • {dayCharges.length} Charges
                            </Typography>
                        </Box>

                        <Stack spacing={2} sx={{ ml: 6 }}>
                            {dayCharges.map((charge) => (
                                <Paper
                                    key={charge.id}
                                    elevation={0}
                                    sx={{
                                        p: 2.5,
                                        border: '1px solid',
                                        borderColor: charge.isNew ? 'primary.main' : 'divider',
                                        borderRadius: 3,
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        bgcolor: charge.isNew ? alpha('#3B82F6', 0.02) : 'background.paper',
                                        animation: charge.isNew ? 'slideIn 0.5s ease-out' : 'none',
                                        '@keyframes slideIn': {
                                            '0%': { opacity: 0, transform: 'translateX(-20px)' },
                                            '100%': { opacity: 1, transform: 'translateX(0)' }
                                        },
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    {charge.isNew && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: -6,
                                            right: 20,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 2,
                                            fontSize: 10,
                                            fontWeight: 900,
                                            boxShadow: 2,
                                            zIndex: 2,
                                            animation: 'pulse 2s infinite'
                                        }}>
                                            NEW CHARGE
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                                            <Box sx={{
                                                p: 1.5,
                                                bgcolor: `${getCategoryColor(charge.category)}15`,
                                                color: getCategoryColor(charge.category),
                                                borderRadius: '12px',
                                                display: 'flex',
                                                boxShadow: `0 4px 10px ${alpha(getCategoryColor(charge.category), 0.2)}`
                                            }}>
                                                {getCategoryIcon(charge.category)}
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 800, mb: 0.2 }}>{charge.description}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Clock size={13} color="#64748B" />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{charge.time}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <User size={13} color="#64748B" />
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{charge.staff}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>₹{charge.amount.toFixed(2)}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Incl. Tax</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                ))}
            </Stack>

            <Box sx={{
                mt: 6,
                p: 4,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 5,
                textAlign: 'center',
                bgcolor: alpha('#F8FAFC', 0.8),
                backdropFilter: 'blur(4px)'
            }}>
                <Zap size={24} color="#CBD5E1" style={{ marginBottom: 12 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                    LISTENING FOR LIVE CHARGES...
                </Typography>
            </Box>
        </Box>
    );
}
