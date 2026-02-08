"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PullToRefresh({ children, onRefresh }: { children: React.ReactNode, onRefresh: () => Promise<void> }) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const threshold = 80;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY.current = e.touches[0].pageY;
            } else {
                startY.current = 0;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (startY.current === 0 || isRefreshing) return;

            const pull = e.touches[0].pageY - startY.current;
            if (pull > 0) {
                // Prevent scrolling while pulling
                if (e.cancelable) e.preventDefault();
                setPullDistance(Math.min(pull * 0.5, threshold + 20));
            }
        };

        const handleTouchEnd = async () => {
            if (startY.current === 0 || isRefreshing) return;

            if (pullDistance >= threshold) {
                setIsRefreshing(true);
                setPullDistance(threshold);
                await onRefresh();
                setIsRefreshing(false);
            }
            setPullDistance(0);
            startY.current = 0;
        };

        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [pullDistance, isRefreshing, onRefresh]);

    return (
        <Box ref={containerRef} className="pull-to-refresh-container" sx={{ minHeight: "100%" }}>
            <Box
                className={`pull-to-refresh-indicator ${pullDistance > 0 || isRefreshing ? "visible" : ""} ${isRefreshing ? "spinning" : ""}`}
                sx={{
                    transform: `translateX(-50%) translateY(${pullDistance}px)`,
                    opacity: pullDistance / threshold,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ArrowPathIcon className="w-5 h-5 text-primary-main" />
            </Box>
            {children}
        </Box>
    );
}
