"use client";

import { Box, Paper, Typography, Stack, Divider, alpha, Tooltip, IconButton, Grid, Chip, Button } from "@mui/material";
import { Calculator, FileText, Globe, Key, ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

export function TaxAccounting() {
    const taxRates = [
        { label: 'City Tax', rate: '2.5%', amount: '$20.80', jurisdiction: 'Municipal' },
        { label: 'State VAT', rate: '7.0%', amount: '$58.24', jurisdiction: 'State' },
        { label: 'Tourism Levy', rate: '1.0%', amount: '$8.32', jurisdiction: 'Federal' },
        { label: 'Service Charge', rate: '10%', amount: '$83.20', jurisdiction: 'Property' },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Tax Compliance & Accounting</Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Calculator size={20} color="#3B82F6" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Tax Breakdown</Typography>
                            </Box>
                            <Tooltip title="View Tax Rules">
                                <IconButton size="small"><HelpCircle size={16} /></IconButton>
                            </Tooltip>
                        </Box>

                        <Stack spacing={2}>
                            {taxRates.map((tax) => (
                                <Box key={tax.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 3 }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{tax.label} ({tax.rate})</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Jurisdiction: {tax.jurisdiction}</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{tax.amount}</Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Total Tax Collection</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>$170.56</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <Globe size={20} color="#10B981" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Integrations</Typography>
                            </Box>
                            <Stack spacing={2}>
                                {[
                                    { name: 'QuickBooks Online', status: 'Connected', icon: 'Q' },
                                    { name: 'Xero Accounting', status: 'Auth Required', icon: 'X' },
                                    { name: 'SAP Finance', status: 'On-Premise', icon: 'S' },
                                ].map((integ) => (
                                    <Box key={integ.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'white', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>
                                                {integ.icon}
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{integ.name}</Typography>
                                        </Box>
                                        <Chip label={integ.status} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, bgcolor: '#FBFEFF' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <ShieldCheck size={20} color="#8B5CF6" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Exemption Vault</Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
                                Manage tax-exempt certificates and diplomatic documentation.
                            </Typography>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }} startIcon={<ExternalLink size={16} />}>
                                Open Vault
                            </Button>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
