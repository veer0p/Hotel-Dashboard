"use client";

import { useState } from "react";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

export type CalendarViewMode = "day" | "week" | "month" | "resources";

export interface CalendarFilters {
    roomType?: string;
    ratePlan?: string;
    guestType?: string;
    status?: string;
}

export interface Reservation {
    id: string;
    guestName: string;
    roomNumber: string;
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    status: "confirmed" | "checked-in" | "checked-out" | "tentative" | "cancelled";
    ratePlan: string;
    price: number;
    nights: number;
    groupId?: string;
}

export function useCalendarState() {
    const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [selectedReservationIds, setSelectedReservationIds] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState<"single" | "multiple">("single");
    const [filters, setFilters] = useState<CalendarFilters>({});
    const [zoomLevel, setZoomLevel] = useState(1);

    const navigateDate = (direction: "prev" | "next" | "today") => {
        if (direction === "today") {
            setSelectedDate(new Date());
            return;
        }

        const increment = direction === "next" ? 1 : -1;

        switch (viewMode) {
            case "day":
                setSelectedDate(prev => direction === "next" ? addDays(prev, 1) : subDays(prev, 1));
                break;
            case "week":
                setSelectedDate(prev => direction === "next" ? addDays(prev, 7) : subDays(prev, 7));
                break;
            case "month":
                setSelectedDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(newDate.getMonth() + increment);
                    return newDate;
                });
                break;
            case "resources":
                setSelectedDate(prev => direction === "next" ? addDays(prev, 7) : subDays(prev, 7));
                break;
        }
    };

    const getDateRange = (): { start: Date; end: Date } => {
        switch (viewMode) {
            case "day":
                return { start: selectedDate, end: selectedDate };
            case "week":
                return {
                    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
                };
            case "month":
                return {
                    start: startOfMonth(selectedDate),
                    end: endOfMonth(selectedDate)
                };
            case "resources":
                return {
                    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
                };
        }
    };

    return {
        viewMode,
        setViewMode,
        selectedDate,
        setSelectedDate,
        selectedReservation,
        setSelectedReservation,
        selectedReservationIds,
        setSelectedReservationIds,
        selectionMode,
        setSelectionMode,
        filters,
        setFilters,
        zoomLevel,
        setZoomLevel,
        navigateDate,
        getDateRange,
    };
}
