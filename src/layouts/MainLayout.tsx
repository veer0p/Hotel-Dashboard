"use client";

import React, { lazy, Suspense } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import SidebarRail from "@/components/layout/SidebarRail";
import AdaptiveTopBar from "@/components/layout/AdaptiveTopBar";
import ContextFooter from "@/components/layout/ContextFooter";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import MobileDrawer from "@/components/layout/MobileDrawer";
import PullToRefresh from "@/components/layout/PullToRefresh";
import SkipLink from "@/components/layout/SkipLink";
import OfflineIndicator from "@/components/layout/OfflineIndicator";
import { useTouchGestures } from "@/lib/hooks/useTouchGestures";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useRealTimePulse } from "@/lib/hooks/useRealTimePulse";
import { useUIState } from "@/lib/ui-state-context";
import ShortcutHelpDialog from "@/components/layout/ShortcutHelpDialog";

// Lazy load non-critical components
const CommandPalette = lazy(() => import("@/components/layout/CommandPalette"));

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const { isShortcutHelpOpen, setIsShortcutHelpOpen } = useUIState();

    // Activate touch gestures for mobile/tablet
    useTouchGestures();

    // Global keyboard shortcuts
    useKeyboardShortcuts();

    // Simulation of real-time pulses
    useRealTimePulse();

    return (
        <>
            <SkipLink />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                {/* Sidebar Rail - Only for Desktop */}
                {isDesktop && <SidebarRail />}

                {/* Mobile/Tablet Drawer */}
                <MobileDrawer />

                <Box
                    component="main"
                    id="main-content"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        ml: isDesktop ? "72px" : 0, // Base offset for collapsed rail
                        bgcolor: "background.default",
                        transition: theme.transitions.create(["margin"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    <AdaptiveTopBar />

                    <Box
                        sx={{
                            p: { xs: 2, sm: 3 },
                            flexGrow: 1,
                            pb: isMobile ? 12 : 6, // Extra padding at bottom for mobile nav or footer
                            position: "relative",
                        }}
                    >
                        <PullToRefresh onRefresh={async () => {
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            console.log("Refreshed!");
                        }}>
                            <Breadcrumbs />
                            {children}
                        </PullToRefresh>
                    </Box>

                    {/* Floating Contextual Footer */}
                    <ContextFooter />

                    {/* Global Command Palette - Lazy Loaded */}
                    <Suspense fallback={null}>
                        <CommandPalette />
                    </Suspense>

                    {/* Mobile Bottom Navigation */}
                    {isMobile && <MobileBottomNav />}
                </Box>
            </Box>

            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Shortcut Help Dialog */}
            <ShortcutHelpDialog
                open={isShortcutHelpOpen}
                onClose={() => setIsShortcutHelpOpen(false)}
            />
        </>
    );
}
