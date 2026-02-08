"use client";

import { useEffect } from "react";
import { useUIState } from "@/lib/ui-state-context";

interface PulseEvent {
    message: string;
    type: "info" | "warning" | "success" | "error";
    timestamp: Date;
}

export function useRealTimePulse() {
    const { setIsNotificationsOpen } = useUIState();

    useEffect(() => {
        const events: string[] = [
            "New reservation for Room 405",
            "Guest Sarah Chen checked out",
            "Maintenance reported in Room 202",
            "Housekeeping completed Room 301",
            "New message from Guest David Kim",
            "Late check-out requested for Room 108",
        ];

        const triggerPulse = () => {
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            console.log(`[WebSocket Pulse]: ${randomEvent}`);

            // In a real app, we would update the notification count or list in UI state
            // For now, we'll just log it to simulate the backend activity
        };

        // Random pulse every 30-60 seconds
        const pulseInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                triggerPulse();
            }
        }, 30000);

        return () => clearInterval(pulseInterval);
    }, []);
}
