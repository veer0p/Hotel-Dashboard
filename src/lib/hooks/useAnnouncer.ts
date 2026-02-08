"use client";

import { useEffect, useRef, useCallback } from "react";

type PolitenessLevel = "polite" | "assertive";

export function useAnnouncer() {
    const liveRegionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create live region if it doesn't exist
        if (!liveRegionRef.current) {
            const liveRegion = document.createElement("div");
            liveRegion.setAttribute("role", "status");
            liveRegion.setAttribute("aria-live", "polite");
            liveRegion.setAttribute("aria-atomic", "true");
            liveRegion.className = "sr-only";
            liveRegion.style.position = "absolute";
            liveRegion.style.left = "-10000px";
            liveRegion.style.width = "1px";
            liveRegion.style.height = "1px";
            liveRegion.style.overflow = "hidden";
            document.body.appendChild(liveRegion);
            liveRegionRef.current = liveRegion;
        }

        return () => {
            if (liveRegionRef.current) {
                document.body.removeChild(liveRegionRef.current);
                liveRegionRef.current = null;
            }
        };
    }, []);

    const announce = useCallback((message: string, politeness: PolitenessLevel = "polite") => {
        if (!liveRegionRef.current) return;

        // Update politeness level
        liveRegionRef.current.setAttribute("aria-live", politeness);

        // Clear and set new message
        liveRegionRef.current.textContent = "";
        setTimeout(() => {
            if (liveRegionRef.current) {
                liveRegionRef.current.textContent = message;
            }
        }, 100);

        // Auto-clear after 5 seconds
        setTimeout(() => {
            if (liveRegionRef.current) {
                liveRegionRef.current.textContent = "";
            }
        }, 5000);
    }, []);

    return { announce };
}
