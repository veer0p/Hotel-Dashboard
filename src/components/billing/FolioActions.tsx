"use client";

import { Box, Paper, Typography, Stack, Button, Divider, IconButton } from "@mui/material";
import { Plus, Download, Printer, Mail, MoreVertical, CreditCard, ChevronRight } from "lucide-react";
import { FolioData } from "@/data/mockFolioData";

interface FolioActionsProps {
    folio: FolioData;
}

export function FolioActions({ folio }: FolioActionsProps) {
    return (
        <Stack spacing={3}>
            {/* Balance Summary */}
            <Paper elevation={0} sx={{ p: 3, bgcolor: '#1E293B', color: 'white', borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>Current Balance</Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, my: 1 }}>${folio.dueAmount}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>Total Folio: ${folio.totalAmount}</Typography>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Stack spacing={1.5}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ bgcolor: '#3B82F6', fontWeight: 800, textTransform: 'none', borderRadius: 3, py: 1.2, '&:hover': { bgcolor: '#2563EB' } }}
                        startIcon={<CreditCard size={18} />}
                    >
                        Process Payment
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 800, textTransform: 'none', borderRadius: 3, py: 1.2, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                    >
                        Settle Balance
                    </Button>
                </Stack>
            </Paper>

            {/* Quick Actions Grid */}
            <Box sx={{ px: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>Quick Actions</Typography>
                <Stack spacing={1}>
                    {[
                        { label: 'Group Folio', icon: Plus, color: '#F59E0B' },
                        { label: 'Apply Discount', icon: Plus, color: '#EF4444' },
                        { label: 'Split Charge', icon: ChevronRight, color: '#10B981' },
                        { label: 'Transfer Balance', icon: ChevronRight, color: '#8B5CF6' },
                    ].map((action, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                            }}
                        >
                            <Box sx={{ p: 1, bgcolor: `${action.color}10`, color: action.color, borderRadius: 2 }}>
                                <action.icon size={16} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{action.label}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Export Options */}
            <Box sx={{ px: 1, mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>Export & Share</Typography>
                <Stack direction="row" spacing={1}>
                    <IconButton sx={{ bgcolor: 'action.hover', borderRadius: 3, p: 2, flexGrow: 1 }}><Download size={18} /></IconButton>
                    <IconButton sx={{ bgcolor: 'action.hover', borderRadius: 3, p: 2, flexGrow: 1 }}><Printer size={18} /></IconButton>
                    <IconButton sx={{ bgcolor: 'action.hover', borderRadius: 3, p: 2, flexGrow: 1 }}><Mail size={18} /></IconButton>
                    <IconButton sx={{ bgcolor: 'action.hover', borderRadius: 3, p: 2 }}><MoreVertical size={18} /></IconButton>
                </Stack>
            </Box>
        </Stack>
    );
}
