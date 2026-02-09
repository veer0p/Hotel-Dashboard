"use client";

import { useState } from "react";
import { Box, Paper, TextField, Typography, Stack, Button, alpha, Chip } from "@mui/material";
import { Sparkles, Zap, Image as ImageIcon, Check } from "lucide-react";
import { FolioCharge } from "@/data/mockFolioData";
import { format } from "date-fns";

interface ParsedCharge {
    item: string;
    quantity: number;
    room: string;
    price?: number;
}

interface ChargeEntryProps {
    onAdd?: (charge: FolioCharge) => void;
}

export function ChargeEntry({ onAdd }: ChargeEntryProps) {
    const [input, setInput] = useState("");
    const [parsed, setParsed] = useState<ParsedCharge | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const quickItems = [
        { label: 'Breakfast', icon: '🍳', category: 'food', price: 25 },
        { label: 'Parking', icon: '🚗', category: 'parking', price: 35 },
        { label: 'Mini-bar', icon: '🍾', category: 'bar', price: 12 },
        { label: 'Room Service', icon: '🍽️', category: 'food', price: 45 },
        { label: 'Late Checkout', icon: '⏰', category: 'room', price: 50 },
        { label: 'Spa Service', icon: '💆', category: 'spa', price: 120 },
    ];

    const handleInputChange = (val: string) => {
        setInput(val);

        // Enhanced NLP Simulation
        const lowerVal = val.toLowerCase();

        // Match: [Quantity] [Item] to [Room] [Price (optional)]
        const qtyMatch = lowerVal.match(/(\d+)\s+([a-zA-Z\s]+?)(?:\s+to|\s+in|\s+for|$)/);
        const roomMatch = lowerVal.match(/(?:room\s+)?(\d{3})/);
        const priceMatch = lowerVal.match(/₹(\d+)/);

        if (qtyMatch && (roomMatch || lowerVal.includes('current'))) {
            setParsed({
                quantity: parseInt(qtyMatch[1]),
                item: qtyMatch[2].trim(),
                room: roomMatch ? roomMatch[1] : '202',
                price: priceMatch ? parseInt(priceMatch[1]) : undefined
            });
        } else {
            setParsed(null);
        }
    };

    const handleQuickCharge = (item: typeof quickItems[0]) => {
        if (onAdd) {
            onAdd({
                id: `c${Date.now()}`,
                date: format(new Date(), 'MMM dd').toUpperCase(),
                time: format(new Date(), 'h:mm a'),
                description: item.label,
                amount: item.price,
                category: item.category as any,
                staff: 'Front Desk',
                isNew: true
            });
        }
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleOCRClick = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            const mockExtracted = "Add 1 bottle of Champagne to room 412 ₹180";
            setInput(mockExtracted);
            setParsed({
                quantity: 1,
                item: "Champagne",
                room: "412",
                price: 180
            });
        }, 1500);
    };

    const handleAdd = () => {
        if (onAdd && parsed) {
            onAdd({
                id: `c${Date.now()}`,
                date: format(new Date(), 'MMM dd').toUpperCase(),
                time: format(new Date(), 'h:mm a'),
                description: `${parsed.quantity} × ${parsed.item} (Room ${parsed.room})`,
                amount: (parsed.price || 15) * parsed.quantity,
                category: 'other',
                staff: 'Front Desk',
                isNew: true
            });
        }
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setInput("");
            setParsed(null);
        }, 2000);
    };

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
                placeholder='Try typing: "Add 2 cokes to room 202" or "Breakfast for 4 in 105"'
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
                                {parsed.quantity} × {parsed.item} (Room {parsed.room}) {parsed.price ? `- ₹${parsed.price * parsed.quantity}` : ''}
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
                            onClick={() => handleQuickCharge(item)}
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
                onClick={handleOCRClick}
                disabled={isScanning}
                sx={{
                    mt: 3,
                    borderRadius: 3,
                    borderStyle: 'dashed',
                    textTransform: 'none',
                    fontWeight: 700,
                    gap: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    borderColor: isScanning ? 'primary.main' : 'divider'
                }}
            >
                {isScanning ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main',
                            animation: 'pulse 1s infinite alternate'
                        }} />
                        Scanning Receipt...
                    </Box>
                ) : (
                    <>
                        <ImageIcon size={18} />
                        Attach Receipt (OCR)
                    </>
                )}
                {isScanning && (
                    <Box sx={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        bgcolor: alpha('#3B82F6', 0.05),
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '2px',
                            bgcolor: 'primary.main',
                            animation: 'scanLine 1.5s linear infinite'
                        }
                    }} />
                )}
            </Button>
        </Paper>
    );
}
