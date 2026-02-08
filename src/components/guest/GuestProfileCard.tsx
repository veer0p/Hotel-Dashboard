"use client";

import { Box, Paper, Typography, Avatar, Chip, Stack, Divider, IconButton } from "@mui/material";
import { Guest } from "@/data/mockGuestData";
import { Mail, Phone, MapPin, CreditCard, Edit2, Star } from "lucide-react";

interface GuestProfileCardProps {
    guest: Guest;
}

export function GuestProfileCard({ guest }: GuestProfileCardProps) {
    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={guest.avatar}
                        sx={{ width: 100, height: 100, mb: 2, border: '4px solid', borderColor: 'background.paper', boxShadow: 3 }}
                    />
                    {guest.status === 'VIP' && (
                        <Chip
                            label="VIP"
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 20,
                                right: -5,
                                bgcolor: '#8B5CF6',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.65rem'
                            }}
                        />
                    )}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{guest.name}</Typography>
                <Typography variant="body2" color="text.secondary">{guest.status} Guest</Typography>
            </Box>

            <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                        <Mail size={16} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.email}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                        <Phone size={16} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Phone</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.phone}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                        <MapPin size={16} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Address</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{guest.address}</Typography>
                    </Box>
                </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Quick Stats</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{guest.staysCount}</Typography>
                    <Typography variant="caption" color="text.secondary">Stays</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>${guest.avgSpend}</Typography>
                    <Typography variant="caption" color="text.secondary">Avg. $</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>${(guest.lifetimeValue / 1000).toFixed(1)}k</Typography>
                    <Typography variant="caption" color="text.secondary">LTV</Typography>
                </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Payment Methods</Typography>
            <Stack spacing={1}>
                {guest.paymentMethods.map((pm, idx) => (
                    <Box key={idx} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CreditCard size={18} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>•••• {pm.last4}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{pm.type}</Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
