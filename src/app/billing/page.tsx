"use client";

import MainLayout from "@/layouts/MainLayout";
import { Box, Typography, Grid, Stack, Button, Tabs, Tab, alpha, IconButton, Paper } from "@mui/material";
import { mockFolioData } from "@/data/mockFolioData";
import { GuestFolioContext } from "@/components/billing/GuestFolioContext";
import { FolioTimeline } from "@/components/billing/FolioTimeline";
import { FolioActions } from "@/components/billing/FolioActions";
import { ChargeEntry } from "@/components/billing/ChargeEntry";
import { PaymentAllocation } from "@/components/billing/PaymentAllocation";
import { TaxAccounting } from "@/components/billing/TaxAccounting";
import { ArrowLeft, History, Zap, Eye, Download, Printer, Split, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BillingFolioPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'live' | 'history' | 'finalize' | 'allocation' | 'compliance'>('live');

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
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>Folio Tracking</Typography>
                                <Zap size={20} color="#F59E0B" fill="#F59E0B" />
                            </Box>
                            <Typography color="text.secondary">Real-time billing intelligence and smart folio management</Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }} startIcon={<Printer size={18} />}>Print Folio</Button>
                        <Button variant="contained" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, px: 3 }}>Finalize Folio</Button>
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
                        <Tab label="Live Portfolio" value="live" icon={<Zap size={18} />} iconPosition="start" />
                        <Tab label="Billing History" value="history" icon={<History size={18} />} iconPosition="start" />
                        <Tab label="Split & Allocate" value="allocation" icon={<Split size={18} />} iconPosition="start" />
                        <Tab label="Compliance & Tax" value="compliance" icon={<ShieldCheck size={18} />} iconPosition="start" />
                        <Tab label="Final Checkout" value="finalize" icon={<Eye size={18} />} iconPosition="start" />
                    </Tabs>
                </Box>
            </Box>

            {/* Main Content Grid */}
            <Grid container spacing={4}>
                {/* Left Column: Guest & Payment Context */}
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <GuestFolioContext folio={mockFolioData} />
                </Grid>

                {/* Center Column: Chronological Timeline or Allocation */}
                <Grid size={{ xs: 12, md: 8, lg: 6.5 }}>
                    {viewMode === 'live' && <FolioTimeline charges={mockFolioData.charges} />}
                    {viewMode === 'allocation' && <PaymentAllocation folio={mockFolioData} />}
                    {viewMode === 'compliance' && <TaxAccounting />}
                    {viewMode === 'history' && (
                        <Paper sx={{ p: 10, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 4 }}>
                            <History size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Folio history logic coming soon...</Typography>
                        </Paper>
                    )}
                    {viewMode === 'finalize' && (
                        <Paper sx={{ p: 10, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 4 }}>
                            <Eye size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
                            <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Checkout finalization preview mode...</Typography>
                        </Paper>
                    )}
                </Grid>

                {/* Right Column: Actions & Totals */}
                <Grid size={{ xs: 12, lg: 2.5 }}>
                    <Stack spacing={4}>
                        <ChargeEntry />
                        <FolioActions folio={mockFolioData} />
                    </Stack>
                </Grid>
            </Grid>
        </MainLayout>
    );
}
