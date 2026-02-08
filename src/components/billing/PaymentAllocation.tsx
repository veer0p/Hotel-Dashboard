"use client";

import { useState } from "react";
import { Box, Paper, Typography, Stack, Button, Checkbox, Divider, alpha, Chip, Slider } from "@mui/material";
import { Split, Users, CheckCircle2, CreditCard, Banknote, Link } from "lucide-react";
import { FolioData } from "@/data/mockFolioData";

interface PaymentAllocationProps {
    folio: FolioData;
}

export function PaymentAllocation({ folio }: PaymentAllocationProps) {
    const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
    const [splitMode, setSplitMode] = useState<'none' | 'equal' | 'custom'>('none');
    const [splitCount, setSplitCount] = useState(2);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'mastercard' | 'cash' | 'link'>('visa');

    const toggleCharge = (id: string) => {
        setSelectedCharges(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectedTotal = folio.charges
        .filter(c => selectedCharges.includes(c.id))
        .reduce((sum, c) => sum + c.amount, 0);

    const paymentMethods = [
        { id: 'visa', label: 'Visa •• 4242', icon: <CreditCard size={18} /> },
        { id: 'mastercard', label: 'MC •• 8812', icon: <CreditCard size={18} /> },
        { id: 'cash', label: 'Cash / Other', icon: <Banknote size={18} /> },
        { id: 'link', label: 'Payment Link', icon: <Link size={18} /> },
    ];

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Split size={20} color="#10B981" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Smart Allocation</Typography>
                </Box>
                {selectedCharges.length > 0 && (
                    <Chip
                        label={`$${selectedTotal.toFixed(2)} Target`}
                        color="success"
                        size="small"
                        sx={{ fontWeight: 900, borderRadius: 2 }}
                    />
                )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 2, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                1. Select Folio Items
            </Typography>

            <Stack spacing={1} sx={{ maxHeight: 250, overflowY: 'auto', pr: 1, mb: 4, bgcolor: alpha('#F1F5F9', 0.5), p: 1, borderRadius: 3 }}>
                {folio.charges.map((charge) => (
                    <Box
                        key={charge.id}
                        onClick={() => toggleCharge(charge.id)}
                        sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: selectedCharges.includes(charge.id) ? 'primary.main' : 'transparent',
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            bgcolor: selectedCharges.includes(charge.id) ? 'white' : 'transparent',
                            transition: 'all 0.2s',
                            boxShadow: selectedCharges.includes(charge.id) ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
                            '&:hover': { bgcolor: 'white', borderColor: 'divider' }
                        }}
                    >
                        <Checkbox
                            checked={selectedCharges.includes(charge.id)}
                            size="small"
                            sx={{ p: 0 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{charge.description}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{charge.category} • {charge.time}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 900 }}>${charge.amount.toFixed(2)}</Typography>
                    </Box>
                ))}
            </Stack>

            {selectedCharges.length > 0 && (
                <Box sx={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, mb: 2, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                        2. Choose Method & Split
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
                        {paymentMethods.map((m) => (
                            <Box
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id as any)}
                                sx={{
                                    p: 1.5,
                                    minWidth: 120,
                                    border: '1px solid',
                                    borderColor: paymentMethod === m.id ? 'primary.main' : 'divider',
                                    borderRadius: 3,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    bgcolor: paymentMethod === m.id ? alpha('#3B82F6', 0.05) : 'white',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: 'primary.main' }
                                }}
                            >
                                <Box sx={{ color: paymentMethod === m.id ? 'primary.main' : 'text.secondary', mb: 0.5 }}>
                                    {m.icon}
                                </Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', whiteSpace: 'nowrap' }}>
                                    {m.label}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Divider sx={{ my: 2, borderStyle: 'dotted' }} />

                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        {(['none', 'equal', 'custom'] as const).map((mode) => (
                            <Button
                                key={mode}
                                variant={splitMode === mode ? 'contained' : 'outlined'}
                                size="small"
                                onClick={() => setSplitMode(mode)}
                                sx={{ borderRadius: 2, textTransform: 'capitalize', fontWeight: 800, flexGrow: 1 }}
                            >
                                {mode}
                            </Button>
                        ))}
                    </Stack>

                    {splitMode === 'equal' && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#F1F5F9', 0.5), borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>Split between</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 900 }}>{splitCount} Guests</Typography>
                            </Box>
                            <Slider
                                value={splitCount}
                                min={2}
                                max={8}
                                onChange={(_, v) => setSplitCount(v as number)}
                                sx={{ color: 'primary.main', height: 6 }}
                            />
                            <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 900, mt: 1, color: 'primary.main' }}>
                                ${(selectedTotal / splitCount).toFixed(2)} / Person
                            </Typography>
                        </Box>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            borderRadius: 4,
                            fontWeight: 900,
                            py: 1.5,
                            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)',
                            bgcolor: '#3B82F6',
                            '&:hover': { bgcolor: '#2563EB' }
                        }}
                        startIcon={<CheckCircle2 size={18} />}
                    >
                        {splitMode === 'none' ? `Pay $${selectedTotal.toFixed(2)}` : 'Confirm Split Allocation'}
                    </Button>
                </Box>
            )}

            {!selectedCharges.length && (
                <Box sx={{ p: 4, textAlign: 'center', opacity: 0.5 }}>
                    <Users size={32} style={{ marginBottom: 12 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Select charges to begin allocation</Typography>
                </Box>
            )}
        </Paper>
    );
}
