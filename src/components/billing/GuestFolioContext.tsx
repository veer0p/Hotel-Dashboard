"use client";

import { Box, Paper, Typography, Stack, Divider, Chip, LinearProgress, alpha } from "@mui/material";
import { CreditCard, Shield, TrendingUp, History, Info } from "lucide-react";
import { FolioData } from "@/data/mockFolioData";

interface GuestFolioContextProps {
    folio: FolioData;
}

export function GuestFolioContext({ folio }: GuestFolioContextProps) {
    const paymentProgress = (folio.paidAmount / folio.totalAmount) * 100;

    return (
        <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                        <CreditCard size={24} />
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{folio.guestName}</Typography>
                            <Chip label="VIP" size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 900, bgcolor: '#F59E0B', color: 'white' }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">Room {folio.roomNumber} • Folio {folio.id}</Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>Payment Status</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{paymentProgress.toFixed(0)}%</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={paymentProgress}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">Paid: ₹{folio.paidAmount}</Typography>
                        <Typography variant="caption" color="text.secondary">Due: ₹{folio.dueAmount}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Shield size={16} color="#10B981" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Credit Status</Typography>
                        </Box>
                        <Chip label="Healthy" size="small" variant="outlined" sx={{ border: 'none', bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 800, height: 24 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp size={16} color="#3B82F6" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Credit Limit</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>₹2,500</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '9px' }}>Current Utilization: 13%</Typography>
                        </Box>
                    </Box>
                </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: '#F8FAFC' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <History size={18} color="#64748B" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Methods</Typography>
                </Box>
                <Stack spacing={1}>
                    {folio.payments.map((p) => (
                        <Box key={p.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'white' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.method} •••• {p.last4}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 800 }}>- ₹{p.amount}</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">{p.date} • Authorized</Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            <Box sx={{ p: 2, bgcolor: alpha('#8B5CF6', 0.1), borderRadius: 3, border: '1px solid', borderColor: alpha('#8B5CF6', 0.2), display: 'flex', gap: 1.5 }}>
                <Info size={20} color="#8B5CF6" />
                <Typography variant="caption" color="#5B21B6" sx={{ fontWeight: 600 }}>
                    Direct billing enabled for TechCorp Inc. (Master Account: #TC-102)
                </Typography>
            </Box>
        </Stack>
    );
}
