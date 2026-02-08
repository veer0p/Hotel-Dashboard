"use client";

import { Box, Paper, Typography, Grid, Stack, Divider, alpha, Chip } from "@mui/material";
import { TrendingUp, Users, DollarSign, Calendar, Activity, Map, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const ltvData = [
    { month: 'Jan', value: 2400 },
    { month: 'Feb', value: 3100 },
    { month: 'Mar', value: 2800 },
    { month: 'Apr', value: 3900 },
    { month: 'May', value: 4500 },
    { month: 'Jun', value: 5200 },
    { month: 'Jul', value: 4800 },
    { month: 'Aug', value: 6100 },
    { month: 'Sep', value: 5800 },
    { month: 'Oct', value: 7200 },
    { month: 'Nov', value: 8100 },
    { month: 'Dec', value: 8420 },
];

const segmentData = [
    { name: 'VIP', value: 15, color: '#8B5CF6' },
    { name: 'Loyal', value: 35, color: '#3B82F6' },
    { name: 'Regular', value: 40, color: '#10B981' },
    { name: 'At Risk', value: 10, color: '#F59E0B' },
];

export function GuestAnalytics() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>Guest Intelligence & CRM Analytics</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Avg. Guest LTV', value: '$4,280', change: '+12.5%', icon: DollarSign, color: '#8B5CF6' },
                    { label: 'Retention Rate', value: '68%', change: '+5.2%', icon: Users, color: '#3B82F6' },
                    { label: 'Repeat Booking', value: '42%', change: '+8.1%', icon: Calendar, color: '#10B981' },
                    { label: 'Sentiment Score', value: '4.8/5', change: '+2.3%', icon: Activity, color: '#F59E0B' },
                ].map((stat, idx) => (
                    <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
                        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 2 }}>
                                    <stat.icon size={24} />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{stat.change}</Typography>
                                    <ArrowUpRight size={14} />
                                </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* LTV Growth Chart */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, height: 400 }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Sarah Chen: LTV Growth Tracking</Typography>
                            <Chip label="Real-time" size="small" sx={{ bgcolor: alpha('#8B5CF6', 0.1), color: '#8B5CF6', fontWeight: 700 }} />
                        </Box>
                        <Box sx={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={ltvData}>
                                    <defs>
                                        <linearGradient id="colorLtv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 700 }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorLtv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Guest Segmentation */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, height: 400 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Portfolio Segmentation</Typography>
                        <Box sx={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={segmentData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {segmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Stack spacing={1.5} sx={{ mt: 2 }}>
                            {segmentData.map((item) => (
                                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{item.value}%</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
