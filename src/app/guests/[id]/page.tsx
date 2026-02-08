"use client";

import { use } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Box, Typography, Button, IconButton, Stack, Chip, Divider, Grid, Paper, Tabs, Tab } from "@mui/material";
import { mockGuests } from "@/data/mockGuestData";
import { GuestProfileCard } from "@/components/guest/GuestProfileCard";
import { GuestStoryTimeline } from "@/components/guest/GuestStoryTimeline";
import { LiveContextPanel } from "@/components/guest/LiveContextPanel";
import { PreferenceVisualizer } from "@/components/guest/PreferenceVisualizer";
import { TagManager } from "@/components/guest/TagManager";
import { CommunicationHub } from "@/components/guest/CommunicationHub";
import { GuestAnalytics } from "@/components/guest/GuestAnalytics";
import { ArrowLeft, MessageSquare, CheckCircle, BookOpen, MoreVertical, History, BarChart3 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuestProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'timeline' | 'messages' | 'analytics'>('timeline');

    // Find guest or fallback to first mock guest if not found
    const guest = mockGuests.find(g => g.id === id) || mockGuests[0];

    return (
        <MainLayout>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IconButton onClick={() => router.back()} sx={{ bgcolor: 'action.hover' }}>
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{guest.name}</Typography>
                        <Chip
                            label={guest.status}
                            size="small"
                            sx={{ bgcolor: guest.status === 'VIP' ? '#8B5CF6' : 'primary.main', color: 'white', fontWeight: 800 }}
                        />
                        <Chip label={`${guest.staysCount} Stays`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                        <Chip label={`LTV: $${guest.lifetimeValue}`} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1.5}>
                        <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>Edit</Button>
                        <Button
                            variant={activeTab === 'messages' ? 'contained' : 'outlined'}
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                            startIcon={<MessageSquare size={16} />}
                            onClick={() => setActiveTab('messages')}
                        >
                            Message
                        </Button>
                        <Button variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none' }} startIcon={<CheckCircle size={16} />}>Check-in Now</Button>
                        <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }} startIcon={<BookOpen size={16} />}>Book Again</Button>
                    </Stack>
                    <IconButton>
                        <MoreVertical size={20} />
                    </IconButton>
                </Box>
            </Box>

            {/* Main Layout Grid */}
            <Grid container spacing={4}>
                {/* Left Column: Profile Card, Preferences, Tags */}
                <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                    <Stack spacing={3}>
                        <GuestProfileCard guest={guest} />
                        <PreferenceVisualizer preferences={guest.preferences} />
                        <TagManager tags={guest.tags} />
                    </Stack>
                </Grid>

                {/* Center Column: Story Timeline / Communication Hub */}
                <Grid size={{ xs: 12, md: 8, lg: 6.5 }}>
                    <Box sx={{ mb: 3 }}>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            sx={{
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '1rem' }
                            }}
                        >
                            <Tab label="Story Timeline" value="timeline" icon={<History size={18} />} iconPosition="start" />
                            <Tab label="Comm Hub" value="messages" icon={<MessageSquare size={18} />} iconPosition="start" />
                            <Tab label="Analytics" value="analytics" icon={<BarChart3 size={18} />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    {activeTab === 'timeline' && (
                        <Paper elevation={0} sx={{ p: 1, bgcolor: 'transparent' }}>
                            <GuestStoryTimeline timeline={guest.timeline} />
                        </Paper>
                    )}
                    {activeTab === 'messages' && <CommunicationHub />}
                    {activeTab === 'analytics' && <GuestAnalytics />}
                </Grid>

                {/* Right Column: Context Panel */}
                <Grid size={{ xs: 12, lg: 2.5 }}>
                    <LiveContextPanel guest={guest} />
                </Grid>
            </Grid>
        </MainLayout>
    );
}
