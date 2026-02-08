"use client";

import { useState, useEffect } from "react";
import { CalendarViewMode, Reservation, CalendarFilters } from "./useCalendarState";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";

export interface Room {
    id: string;
    number: string;
    floor: number;
    type: string;
    status: "available" | "occupied" | "maintenance" | "dirty";
}

// Mock data generator
const generateMockReservations = (count: number): Reservation[] => {
    const guests = ["Sarah Chen", "Alex Patel", "Michael Torres", "Lisa Wang", "James Wilson", "Emma Davis", "David Kim", "Sophie Martin"];
    const statuses: Reservation["status"][] = ["confirmed", "checked-in", "tentative"];
    const ratePlans = ["Standard", "Advance Purchase", "Corporate", "Weekend Special"];

    const reservations: Reservation[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const checkIn = new Date(today);
        checkIn.setDate(today.getDate() + Math.floor(Math.random() * 30) - 15);
        const nights = Math.floor(Math.random() * 5) + 1;
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkIn.getDate() + nights);

        // Assign to a group occasionally (10% chance)
        const groupId = Math.random() > 0.9 ? `GRP-${Math.floor(i / 5)}` : undefined;

        reservations.push({
            id: `RES-${1000 + i}`,
            guestName: guests[Math.floor(Math.random() * guests.length)],
            roomNumber: `${Math.floor(Math.random() * 3) + 1}${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}`,
            roomId: `room-${i}`,
            checkIn,
            checkOut,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            ratePlan: ratePlans[Math.floor(Math.random() * ratePlans.length)],
            price: Math.floor(Math.random() * 200) + 100,
            nights,
            groupId,
        });
    }

    return reservations;
};

const generateMockRooms = (): Room[] => {
    const rooms: Room[] = [];
    const types = ["Standard", "Deluxe", "Suite"];

    for (let floor = 1; floor <= 3; floor++) {
        for (let room = 1; room <= 20; room++) {
            rooms.push({
                id: `room-${floor}-${room}`,
                number: `${floor}${String(room).padStart(2, "0")}`,
                floor,
                type: types[Math.floor(Math.random() * types.length)],
                status: "available",
            });
        }
    }

    return rooms.sort((a, b) => a.number.localeCompare(b.number));
};

export function useCalendarData(selectedDate: Date, viewMode: CalendarViewMode) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setIsLoading(true);

        const timer = setTimeout(() => {
            setReservations(generateMockReservations(50));
            setRooms(generateMockRooms());
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedDate, viewMode]);

    const filterReservations = (filters: CalendarFilters): Reservation[] => {
        return reservations.filter(reservation => {
            if (filters.status && reservation.status !== filters.status) return false;
            if (filters.ratePlan && reservation.ratePlan !== filters.ratePlan) return false;
            // Add more filter logic as needed
            return true;
        });
    };

    const updateReservation = (reservationId: string, updates: Partial<Reservation>) => {
        setReservations(prev =>
            prev.map(res =>
                res.id === reservationId
                    ? { ...res, ...updates }
                    : res
            )
        );
    };

    const addReservation = (reservation: Reservation) => {
        setReservations(prev => [reservation, ...prev]);
    };

    return {
        reservations,
        rooms,
        isLoading,
        filterReservations,
        updateReservation,
        addReservation,
    };
}
