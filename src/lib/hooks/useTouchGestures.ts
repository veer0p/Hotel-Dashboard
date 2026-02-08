"use client";

import { useEffect, useRef } from "react";
import { useUIState } from "@/lib/ui-state-context";

interface TouchGestureConfig {
    swipeThreshold?: number;
    edgeThreshold?: number;
    doubleTapDelay?: number;
}

export function useTouchGestures(config: TouchGestureConfig = {}) {
    const { setIsDrawerOpen } = useUIState();
    const {
        swipeThreshold = 50,
        edgeThreshold = 50,
        doubleTapDelay = 300,
    } = config;

    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const lastTap = useRef<number>(0);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current) return;

            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            };

            const dx = touchEnd.x - touchStart.current.x;
            const dy = touchEnd.y - touchStart.current.y;

            // Horizontal swipe detection
            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > swipeThreshold) {
                    if (dx > 0 && touchStart.current.x < edgeThreshold) {
                        // Swipe from left edge -> Open Drawer
                        setIsDrawerOpen(true);
                        // Provide haptic feedback if available
                        if (window.navigator && window.navigator.vibrate) {
                            window.navigator.vibrate(10);
                        }
                    } else if (dx < 0 && touchStart.current.x > window.innerWidth - edgeThreshold) {
                        // Swipe from right edge -> Open Notifications (Future optimization)
                        console.log("Swipe from right edge detected");
                    }
                }
            }

            touchStart.current = null;
        };

        const handleDoubleTap = () => {
            const now = Date.now();
            if (now - lastTap.current < doubleTapDelay) {
                // Double tap detected -> Scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
                lastTap.current = 0;
            } else {
                lastTap.current = now;
            }
        };

        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("touchstart", handleDoubleTap);

        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("touchstart", handleDoubleTap);
        };
    }, [setIsDrawerOpen, swipeThreshold, edgeThreshold, doubleTapDelay]);
}
