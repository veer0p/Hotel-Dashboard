"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIState } from "@/lib/ui-state-context";

export function useKeyboardShortcuts() {
    const router = useRouter();
    const { setIsCommandPaletteOpen, isCommandPaletteOpen, setActiveContext } = useUIState();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Cmd or Ctrl modifier
            const mod = e.metaKey || e.ctrlKey;

            // Cmd+K: Command Palette
            if (mod && e.key === "k") {
                e.preventDefault();
                setIsCommandPaletteOpen(!isCommandPaletteOpen);
            }

            // Cmd+1 to Cmd+6: Navigation
            if (mod && e.key >= "1" && e.key <= "6") {
                e.preventDefault();
                const paths = [
                    "/",
                    "/calendar",
                    "/rooms",
                    "/guest-profile",
                    "/checkin",
                    "/billing",
                ];
                const index = parseInt(e.key) - 1;
                if (paths[index]) {
                    router.push(paths[index]);
                }
            }

            // Escape: Close all / Clear selection
            if (e.key === "Escape") {
                setIsCommandPaletteOpen(false);
                setActiveContext(null);
            }

            // Cmd+N: Contextual New Action (Placeholder)
            if (mod && e.key === "n") {
                e.preventDefault();
                console.log("Global New Action triggered");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router, setIsCommandPaletteOpen, isCommandPaletteOpen, setActiveContext]);
}
