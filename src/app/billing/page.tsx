"use client";

import MainLayout from "@/layouts/MainLayout";
import { Box, Typography, Grid, Stack, Button, Tabs, Tab, alpha, IconButton, Paper, Chip } from "@mui/material";
import { mockFolioData, FolioCharge } from "@/data/mockFolioData";
import { format } from "date-fns";
import { GuestFolioContext } from "@/components/billing/GuestFolioContext";
import { FolioTimeline } from "@/components/billing/FolioTimeline";
import { FolioActions } from "@/components/billing/FolioActions";
import { ChargeEntry } from "@/components/billing/ChargeEntry";
import { PaymentAllocation } from "@/components/billing/PaymentAllocation";
import { TaxAccounting } from "@/components/billing/TaxAccounting";
import { ArrowLeft, History, Zap, Eye, Download, Printer, Split, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BillingFolioPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'live' | 'history' | 'finalize' | 'allocation' | 'compliance'>('live');
    const [folio, setFolio] = useState(mockFolioData);
    const [isSimulating, setIsSimulating] = useState(true);

    // Simulated Real-time WebSocket Updates
    useEffect(() => {
        if (!isSimulating || viewMode !== 'live') return;

        const interval = setInterval(() => {
            const newCharge: FolioCharge = {
                id: `c${Date.now()}`,
                date: 'DEC 16',
                time: format(new Date(), 'h:mm a'),
                description: 'Lobby Bar: Craft Cocktail',
                amount: 14,
                category: 'bar',
                staff: 'John Bartender',
                isNew: true
            };

            setFolio(prev => ({
                ...prev,
                charges: [newCharge, ...prev.charges],
                totalAmount: prev.totalAmount + newCharge.amount,
                dueAmount: prev.dueAmount + newCharge.amount
            }));

            // Reset isNew after 5 seconds
            setTimeout(() => {
                setFolio(prev => ({
                    ...prev,
                    charges: prev.charges.map(c => c.id === newCharge.id ? { ...c, isNew: false } : c)
                }));
            }, 5000);

        }, 15000); // New charge every 15 seconds for demo

        return () => clearInterval(interval);
    }, [isSimulating, viewMode]);

    return (
        <MainLayout>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => router.back()} sx={{ bgcolor: 'action.hover' }}>
                            <ArrowLeft size={20} />
                        </IconButton>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>Folio • {folio.guestName}</Typography>
                                <Chip
                                    label={`#${folio.id}`}
                                    size="small"
                                    sx={{ fontWeight: 800, bgcolor: alpha('#3B82F6', 0.1), color: '#3B82F6' }}
                                />
                                {isSimulating && viewMode === 'live' && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                                        <Box sx={{ width: 8, height: 8, bgcolor: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                        <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 800 }}>LIVE</Typography>
                                    </Box>
                                )}
                            </Box>
                            <Typography color="text.secondary">
                                Room {folio.roomNumber} • Stay #{folio.reservationId} • Total: ${folio.totalAmount}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsSimulating(!isSimulating)}
                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                        >
                            {isSimulating ? 'Pause Live' : 'Resume Live'}
                        </Button>
                        <Button variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }} startIcon={<Printer size={18} />}>Print</Button>
                        <Button variant="contained" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, px: 3 }}>Checkout</Button>
                    </Stack>
                </Box>

                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Tabs
                        value={viewMode}
                        onChange={(_, v) => setViewMode(v)}
                        sx={{
                            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, px: 4 },
                            '& .Mui-selected': { color: 'primary.main' }
                        }}
                    >
                        <Tab label="Live Folio" value="live" icon={<Zap size={18} />} iconPosition="start" />
                        <Tab label="History" value="history" icon={<History size={18} />} iconPosition="start" />
                        <Tab label="Splitting" value="allocation" icon={<Split size={18} />} iconPosition="start" />
                        <Tab label="Tax & Accounting" value="compliance" icon={<ShieldCheck size={18} />} iconPosition="start" />
                    </Tabs>
                </Box>
            </Box>

            {/* Main Content Grid - 25% / 50% / 25% */}
            <Grid container spacing={4}>
                {/* Left Column: Guest & Payment Context (25%) */}
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <GuestFolioContext folio={folio} />
                </Grid>

                {/* Center Column: Chronological Timeline (50%) */}
                <Grid size={{ xs: 12, md: 8, lg: 6 }}>
                    {viewMode === 'live' && <FolioTimeline charges={folio.charges} />}
                    {viewMode === 'allocation' && <PaymentAllocation folio={folio} />}
                    {viewMode === 'compliance' && <TaxAccounting />}
                    {viewMode === 'history' && (
                        <Paper sx={{ p: 10, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 4 }}>
                            <History size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Billing history archive...</Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Right Column: Quick Actions & Totals (25%) */}
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack spacing={4}>
                        <ChargeEntry onAdd={(charge) => {
                            setFolio(prev => ({
                                ...prev,
                                charges: [charge, ...prev.charges],
                                totalAmount: prev.totalAmount + charge.amount,
                                dueAmount: prev.dueAmount + charge.amount
                            }));
                        }} />
                        <FolioActions folio={folio} />
                    </Stack>
                </Grid>
            </Grid>
        </MainLayout>
    );
}
