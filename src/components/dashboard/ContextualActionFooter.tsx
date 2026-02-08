"use client";

import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { LogIn, Key, ShieldCheck, FileText, MessageSquare, Utensils } from "lucide-react";

export default function ContextualActionFooter() {
    const [shift, setShift] = useState<'morning' | 'evening' | 'night'>('morning');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            const hour = now.getHours();

            if (hour >= 6 && hour < 14) {
                setShift('morning');
            } else if (hour >= 14 && hour < 22) {
                setShift('evening');
            } else {
                setShift('night');
            }
        }, 60000);

        // Initial check
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 14) {
            setShift('morning');
        } else if (hour >= 14 && hour < 22) {
            setShift('evening');
        } else {
            setShift('night');
        }

        return () => clearInterval(timer);
    }, []);

    const getActions = () => {
        switch (shift) {
            case 'morning':
                return [
                    { label: 'Check-in', icon: <LogIn size={18} />, color: 'primary' },
                    { label: 'New Booking', icon: <Key size={18} />, color: 'primary' },
                    { label: 'Housekeeping', icon: <ShieldCheck size={18} />, color: 'primary' },
                ];
            case 'evening':
                return [
                    { label: 'Check-out', icon: <LogIn size={18} />, color: 'secondary' },
                    { label: 'Restaurant', icon: <Utensils size={18} />, color: 'secondary' },
                    { label: 'Messages', icon: <MessageSquare size={18} />, color: 'secondary' },
                ];
            case 'night':
                return [
                    { label: 'Night Audit', icon: <ShieldCheck size={18} />, color: 'info' },
                    { label: 'Reports', icon: <FileText size={18} />, color: 'info' },
                    { label: 'Security', icon: <ShieldCheck size={18} />, color: 'info' },
                ];
        }
    };

    const actions = getActions();

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                pointerEvents: 'none',
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    pointerEvents: 'auto',
                    px: 3,
                    py: 1.5,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                }}
            >
                <Box sx={{ mr: 2, borderRight: '1px solid', borderColor: 'divider', pr: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {shift} Shift
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant="contained"
                            size="small"
                            startIcon={action.icon}
                            color={action.color as any}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 4,
                                px: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                '&:active': {
                                    transform: 'scale(0.95)',
                                }
                            }}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}
