"use client";

import { useState, useRef } from "react";
import { Box, Paper, TextField, Typography, Stack, Button, alpha, Chip, InputAdornment, Tooltip } from "@mui/material";
import { Sparkles, Zap, Package, Image as ImageIcon, Check, X, Search } from "lucide-react";

interface ParsedCharge {
    item: string;
    quantity: number;
    room: string;
    price?: number;
}

export function ChargeEntry() {
    const [input, setInput] = useState("");
    const [parsed, setParsed] = useState<ParsedCharge | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (val: string) => {
        setInput(val);

        // Simple NLP Simulation: "Add 2 cokes to room 202"
        const lowerVal = val.toLowerCase();
        const qtyMatch = lowerVal.match(/(\d+)\s+(\w+)/);
        const roomMatch = lowerVal.match(/room\s+(\d+)/);

        if (qtyMatch && roomMatch) {
            setParsed({
                quantity: parseInt(qtyMatch[1]),
                item: qtyMatch[2],
                room: roomMatch[1]
            });
        } else {
            setParsed(null);
        }
    };

    const handleAdd = () => {
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setInput("");
            setParsed(null);
        }, 2000);
    };

    const quickItems = [
        { label: 'Breakfast', icon: '🍳', category: 'food' },
        { label: 'Parking', icon: '🚗', category: 'parking' },
        { label: 'Mini-bar', icon: '🍾', category: 'bar' },
        { label: 'Room Service', icon: '🍽️', category: 'food' },
        { label: 'Late Checkout', icon: '⏰', category: 'room' },
        { label: 'Spa Service', icon: '💆', category: 'spa' },
    ];

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Zap size={20} color="#F59E0B" fill="#F59E0B" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Smart Charge Entry</Typography>
            </Box>

            <TextField
                fullWidth
                multiline
                rows={2}
                placeholder='Try typing: "Add 2 cokes to room 202" or "Breakfast for 4 in room 105"'
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        '& fieldset': { border: 'none' },
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                    }
                }}
            />

            {parsed && !isSuccess && (
                <Box sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: alpha('#3B82F6', 0.05),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha('#3B82F6', 0.2),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                            <Sparkles size={16} />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Interpreted Charge</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {parsed.quantity} × {parsed.item} (Room {parsed.room})
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAdd}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
                    >
                        Confirm
                    </Button>
                </Box>
            )}

            {isSuccess && (
                <Box sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: alpha('#10B981', 0.05),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha('#10B981', 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Check size={18} color="#10B981" />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#065F46' }}>Charge added successfully!</Typography>
                </Box>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5, display: 'block' }}>
                    Quick Charges
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    {quickItems.map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                p: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2.5,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.1s',
                                '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main', transform: 'scale(1.02)' }
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 0.5 }}>{item.icon}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>{item.label}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, borderRadius: 3, borderStyle: 'dashed', textTransform: 'none', fontWeight: 700, gap: 1 }}
            >
                <ImageIcon size={18} />
                Attach Receipt (OCR)
            </Button>
        </Paper>
    );
}
