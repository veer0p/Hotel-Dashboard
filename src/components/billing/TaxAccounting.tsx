"use client";

import { Box, Paper, Typography, Stack, Divider, alpha, Grid, Chip, Button } from "@mui/material";
import { Calculator, FileText, Globe, ShieldCheck, ExternalLink } from "lucide-react";

export function TaxAccounting() {
    const taxRates = [
        { label: 'City Tax', rate: '2.5%', amount: '$20.80', jurisdiction: 'Municipal' },
        { label: 'State VAT', rate: '7.0%', amount: '$58.24', jurisdiction: 'State' },
        { label: 'Tourism Levy', rate: '1.0%', amount: '$8.32', jurisdiction: 'Federal' },
        { label: 'Service Charge', rate: '10%', amount: '$83.20', jurisdiction: 'Property' },
    ];

    const auditLogs = [
        { id: 1, action: 'Tax Rate Update', user: 'Admin (JS)', time: '2h ago', status: 'verified' },
        { id: 2, action: 'Folio Finalization', user: 'System', time: '5h ago', status: 'verified' },
        { id: 3, action: 'Exemption Override', user: 'Manager (AL)', time: '1d ago', status: 'exception' },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Tax Compliance & Accounting</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FileText size={16} />}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                        Export CSV
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShieldCheck size={16} />}
                        sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                    >
                        Batch Audit
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 4, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Calculator size={20} color="#3B82F6" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Tax Breakdown</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981', bgcolor: alpha('#10B981', 0.1), px: 1, py: 0.5, borderRadius: 1 }}>
                                    Live Calculation
                                </Typography>
                            </Box>
                        </Box>

                        <Stack spacing={2}>
                            {taxRates.map((tax) => (
                                <Box key={tax.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: alpha('#F1F5F9', 0.5), borderRadius: 3, border: '1px solid', borderColor: 'transparent', transition: '0.2s', '&:hover': { borderColor: 'divider', bgcolor: 'white' } }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{tax.label} ({tax.rate})</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Jurisdiction: {tax.jurisdiction}</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{tax.amount}</Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Total Collected</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>$170.56</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <FileText size={18} color="#64748B" />
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Audit Log</Typography>
                        </Box>
                        <Stack spacing={1.5}>
                            {auditLogs.map((log) => (
                                <Box key={log.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: log.status === 'verified' ? '#10B981' : '#F59E0B' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.action}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{log.user}</Typography>
                                        <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: alpha('#3B82F6', 0.02) }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Globe size={20} color="#10B981" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Integrations</Typography>
                            </Box>
                            <Stack spacing={2}>
                                {[
                                    { name: 'QuickBooks Online', status: 'Connected', icon: 'Q', color: '#2CA01C' },
                                    { name: 'Xero Accounting', status: 'Auth Required', icon: 'X', color: '#13B5EA' },
                                    { name: 'SAP Finance', status: 'On-Premise', icon: 'S', color: '#008FD3' },
                                ].map((integ) => (
                                    <Box key={integ.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'white' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 32, height: 32, bgcolor: integ.color, color: 'white', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                                                {integ.icon}
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{integ.name}</Typography>
                                        </Box>
                                        <Chip label={integ.status} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.65rem', border: 'none', bgcolor: alpha(integ.color, 0.1), color: integ.color }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: '#FBFEFF' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <ShieldCheck size={20} color="#8B5CF6" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Exemption Vault</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 700 }}>
                                4 Active Exemption Certificates found in this jurisdiction.
                            </Typography>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, borderColor: 'divider' }} startIcon={<ExternalLink size={16} />}>
                                Manage Documents
                            </Button>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
