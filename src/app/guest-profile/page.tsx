"use client";

import MainLayout from "@/layouts/MainLayout";
import { Typography, Box, Paper, Button, TextField, InputAdornment, Avatar, Chip, Stack, alpha } from "@mui/material";
import { useUIState } from "@/lib/ui-state-context";
import { UserPlus, Search, ArrowRight, UserCheck, Star } from "lucide-react";
import { useState } from "react";
import { mockGuests } from "@/data/mockGuestData";
import Link from "next/link";

export default function GuestProfilePage() {
    const { setActiveContext } = useUIState();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGuests = mockGuests.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Guest Directory
                    </Typography>
                    <Typography color="text.secondary">
                        Comprehensive guest relationship management (CRM)
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<UserPlus size={18} />}
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none", px: 3 }}
                >
                    New Guest
                </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search guests by name, email, phone or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={20} color="#94A3B8" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 3, bgcolor: 'action.hover', border: 'none', '& fieldset': { border: 'none' } }
                        }}
                    />
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {searchQuery ? 'Search Results' : 'Recent Profiles'}
                </Typography>

                <Stack spacing={2}>
                    {filteredGuests.map(guest => (
                        <Paper
                            key={guest.id}
                            component={Link}
                            href={`/guests/${guest.id}`}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s',
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateX(4px)',
                                    bgcolor: alpha('#3B82F6', 0.02)
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Avatar
                                    src={guest.avatar}
                                    sx={{ width: 64, height: 64, border: '2px solid', borderColor: 'divider' }}
                                />
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{guest.name}</Typography>
                                        {guest.status === 'VIP' && <Star size={14} fill="#8B5CF6" color="#8B5CF6" />}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">{guest.email}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{guest.staysCount}</Typography>
                                    <Typography variant="caption" color="text.secondary">Stays</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>${guest.lifetimeValue}</Typography>
                                    <Typography variant="caption" color="text.secondary">LTV</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {guest.tags.slice(0, 2).map(tag => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                                    ))}
                                </Box>
                                <ArrowRight size={20} color="#94A3B8" />
                            </Box>
                        </Paper>
                    ))}

                    {filteredGuests.length === 0 && (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <Typography color="text.secondary">No guests found matching your search</Typography>
                        </Box>
                    )}
                </Stack>
            </Paper>
        </MainLayout>
    );
}
