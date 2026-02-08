"use client";

import { useState } from "react";
import { Box, Paper, Typography, Stack, Button, Checkbox, Divider, alpha, Chip, Slider } from "@mui/material";
import { DollarSign, Split, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { FolioData, FolioCharge } from "@/data/mockFolioData";

interface PaymentAllocationProps {
    folio: FolioData;
}

export function PaymentAllocation({ folio }: PaymentAllocationProps) {
    const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
    const [splitMode, setSplitMode] = useState<'none' | 'equal' | 'custom'>('none');
    const [splitCount, setSplitCount] = useState(2);

    const toggleCharge = (id: string) => {
        setSelectedCharges(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectedTotal = folio.charges
        .filter(c => selectedCharges.includes(c.id))
        .reduce((sum, c) => sum + c.amount, 0);

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Split size={20} color="#10B981" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Payment Allocation</Typography>
                </Box>
                {selectedCharges.length > 0 && (
                    <Chip
                        label={`$${selectedTotal} Selected`}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 800, borderRadius: 2 }}
                    />
                )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 2, display: 'block' }}>
                Select charges to allocate payment or split
            </Typography>

            <Stack spacing={1} sx={{ maxHeight: 300, overflowY: 'auto', pr: 1, mb: 3 }}>
                {folio.charges.map((charge) => (
                    <Box
                        key={charge.id}
                        onClick={() => toggleCharge(charge.id)}
                        sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: selectedCharges.includes(charge.id) ? 'primary.main' : 'divider',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            cursor: 'pointer',
                            bgcolor: selectedCharges.includes(charge.id) ? alpha('#3B82F6', 0.02) : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <Checkbox
                            checked={selectedCharges.includes(charge.id)}
                            size="small"
                            sx={{ p: 0 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{charge.description}</Typography>
                            <Typography variant="caption" color="text.secondary">{charge.date} • {charge.category}</Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>${charge.amount}</Typography>
                    </Box>
                ))}
            </Stack>

            {selectedCharges.length > 0 && (
                <Box sx={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Split Configuration</Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                        <Button
                            variant={splitMode === 'none' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSplitMode('none')}
                            sx={{ borderRadius: 2, textTransform: 'none', flexGrow: 1 }}
                        >
                            Full
                        </Button>
                        <Button
                            variant={splitMode === 'equal' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSplitMode('equal')}
                            sx={{ borderRadius: 2, textTransform: 'none', flexGrow: 1 }}
                        >
                            Equal
                        </Button>
                        <Button
                            variant={splitMode === 'custom' ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setSplitMode('custom')}
                            sx={{ borderRadius: 2, textTransform: 'none', flexGrow: 1 }}
                        >
                            Custom
                        </Button>
                    </Stack>

                    {splitMode === 'equal' && (
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>Number of Guests</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>{splitCount}</Typography>
                            </Box>
                            <Slider
                                value={splitCount}
                                min={2}
                                max={10}
                                onChange={(_, v) => setSplitCount(v as number)}
                                sx={{ color: 'primary.main' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center', fontWeight: 600 }}>
                                Each guest pays: ${(selectedTotal / splitCount).toFixed(2)}
                            </Typography>
                        </Box>
                    )}

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ borderRadius: 3, fontWeight: 800, py: 1.5, gap: 1 }}
                        startIcon={<CheckCircle2 size={18} />}
                    >
                        Apply Allocation
                    </Button>
                </Box>
            )}
        </Paper>
    );
}
