"use client";

import { Paper, Typography, Box } from "@mui/material";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { MetricData } from "@/data/mockDashboardData";
import { memo } from "react";

interface MetricCardProps {
    metric: MetricData;
}

const MetricCard = memo(function MetricCard({ metric }: MetricCardProps) {
    const getTrendIcon = () => {
        if (metric.trendDirection === 'up') {
            return <TrendingUp size={16} className="text-green-500" />;
        } else if (metric.trendDirection === 'down') {
            return <TrendingDown size={16} className="text-red-500" />;
        }
        return <Minus size={16} className="text-gray-400" />;
    };

    const getTrendColor = () => {
        if (metric.trendDirection === 'up') return 'text-green-600';
        if (metric.trendDirection === 'down') return 'text-red-600';
        return 'text-gray-500';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, mb: 1 }}
            >
                {metric.label}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                    }}
                >
                    {metric.value}
                </Typography>

                {metric.trend !== 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getTrendIcon()}
                        <Typography
                            variant="caption"
                            className={getTrendColor()}
                            sx={{ fontWeight: 600 }}
                        >
                            {Math.abs(metric.trend)}%
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
});

export default MetricCard;
