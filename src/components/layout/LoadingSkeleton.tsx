"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function LoadingSkeleton() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar Skeleton */}
            <Box
                sx={{
                    width: 72,
                    bgcolor: "background.paper",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    display: { xs: "none", lg: "block" },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                </Box>
                {[...Array(6)].map((_, i) => (
                    <Box key={i} sx={{ p: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                    </Box>
                ))}
            </Box>

            {/* Main Content Skeleton */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* TopBar Skeleton */}
                <Box
                    sx={{
                        height: 64,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        px: 3,
                        gap: 2,
                    }}
                >
                    <Skeleton variant="rectangular" width={400} height={40} sx={{ borderRadius: 2 }} />
                    <Box sx={{ flexGrow: 1 }} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="circular" width={40} height={40} />
                </Box>

                {/* Content Area Skeleton */}
                <Box sx={{ p: 3, flexGrow: 1 }}>
                    {/* Breadcrumbs */}
                    <Skeleton variant="text" width={200} height={24} sx={{ mb: 3 }} />

                    {/* Metric Cards */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb: 3 }}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                        ))}
                    </Box>

                    {/* Charts */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 2 }}>
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
