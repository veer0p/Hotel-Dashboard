"use client";

import { useState, useCallback } from "react";
import { Reservation } from "./useCalendarState";
import { Room } from "./useCalendarData";
import { addDays, differenceInDays, isBefore, isAfter } from "date-fns";

export type DragMode = "move" | "extend-start" | "extend-end";

export interface DragState {
    isDragging: boolean;
    draggedReservation: Reservation | null;
    dragMode: DragMode | null;
    previewDates: { checkIn: Date; checkOut: Date } | null;
    targetRoom: string | null;
    isValidDrop: boolean;
}

export interface ConflictCheck {
    hasConflict: boolean;
    conflictingReservations: Reservation[];
    message?: string;
}

export function useDragDrop(
    reservations: Reservation[],
    rooms: Room[],
    onReservationUpdate: (reservationId: string, updates: Partial<Reservation>) => void
) {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedReservation: null,
        dragMode: null,
        previewDates: null,
        targetRoom: null,
        isValidDrop: false,
    });

    // Check for overlapping reservations
    const checkConflicts = useCallback(
        (
            roomNumber: string,
            checkIn: Date,
            checkOut: Date,
            excludeReservationId?: string
        ): ConflictCheck => {
            const conflictingReservations = reservations.filter((res) => {
                if (res.id === excludeReservationId) return false;
                if (res.roomNumber !== roomNumber) return false;

                // Check for date overlap
                const hasOverlap =
                    (isBefore(checkIn, res.checkOut) && isAfter(checkOut, res.checkIn)) ||
                    (isBefore(res.checkIn, checkOut) && isAfter(res.checkOut, checkIn));

                return hasOverlap;
            });

            return {
                hasConflict: conflictingReservations.length > 0,
                conflictingReservations,
                message:
                    conflictingReservations.length > 0
                        ? `Conflicts with ${conflictingReservations.length} existing reservation(s)`
                        : undefined,
            };
        },
        [reservations]
    );

    // Validate rate plan rules
    const validateRatePlan = useCallback(
        (checkIn: Date, checkOut: Date, ratePlan: string): { isValid: boolean; message?: string } => {
            const nights = differenceInDays(checkOut, checkIn);

            // Example rules - customize based on your business logic
            const rules: Record<string, { minNights: number; maxNights: number }> = {
                "Weekend Special": { minNights: 2, maxNights: 3 },
                "Advance Purchase": { minNights: 1, maxNights: 14 },
                Standard: { minNights: 1, maxNights: 30 },
                Corporate: { minNights: 1, maxNights: 7 },
            };

            const rule = rules[ratePlan];
            if (!rule) return { isValid: true };

            if (nights < rule.minNights) {
                return {
                    isValid: false,
                    message: `${ratePlan} requires minimum ${rule.minNights} night(s)`,
                };
            }

            if (nights > rule.maxNights) {
                return {
                    isValid: false,
                    message: `${ratePlan} allows maximum ${rule.maxNights} night(s)`,
                };
            }

            return { isValid: true };
        },
        []
    );

    // Check if room is available
    const isRoomAvailable = useCallback(
        (roomNumber: string): boolean => {
            const room = rooms.find((r) => r.number === roomNumber);
            return room ? room.status === "available" : false;
        },
        [rooms]
    );

    // Start dragging
    const handleDragStart = useCallback(
        (reservation: Reservation, mode: DragMode) => {
            setDragState({
                isDragging: true,
                draggedReservation: reservation,
                dragMode: mode,
                previewDates: {
                    checkIn: reservation.checkIn,
                    checkOut: reservation.checkOut,
                },
                targetRoom: reservation.roomNumber,
                isValidDrop: true,
            });
        },
        []
    );

    // Update drag preview
    const handleDragMove = useCallback(
        (targetDate?: Date, targetRoom?: string) => {
            if (!dragState.draggedReservation || !dragState.dragMode) return;

            let newCheckIn = dragState.draggedReservation.checkIn;
            let newCheckOut = dragState.draggedReservation.checkOut;
            let newRoom = targetRoom || dragState.draggedReservation.roomNumber;

            // Calculate new dates based on drag mode
            if (targetDate) {
                switch (dragState.dragMode) {
                    case "move":
                        const duration = differenceInDays(
                            dragState.draggedReservation.checkOut,
                            dragState.draggedReservation.checkIn
                        );
                        newCheckIn = targetDate;
                        newCheckOut = addDays(targetDate, duration);
                        break;
                    case "extend-start":
                        newCheckIn = targetDate;
                        break;
                    case "extend-end":
                        newCheckOut = targetDate;
                        break;
                }
            }

            // Validate the new dates and room
            const conflictCheck = checkConflicts(
                newRoom,
                newCheckIn,
                newCheckOut,
                dragState.draggedReservation.id
            );

            const ratePlanCheck = validateRatePlan(
                newCheckIn,
                newCheckOut,
                dragState.draggedReservation.ratePlan
            );

            const roomAvailable = isRoomAvailable(newRoom);

            const isValid =
                !conflictCheck.hasConflict &&
                ratePlanCheck.isValid &&
                roomAvailable &&
                isBefore(newCheckIn, newCheckOut);

            setDragState((prev) => ({
                ...prev,
                previewDates: { checkIn: newCheckIn, checkOut: newCheckOut },
                targetRoom: newRoom,
                isValidDrop: isValid,
            }));
        },
        [dragState, checkConflicts, validateRatePlan, isRoomAvailable]
    );

    // End dragging and apply changes
    const handleDragEnd = useCallback(() => {
        if (
            !dragState.draggedReservation ||
            !dragState.isValidDrop ||
            !dragState.previewDates
        ) {
            setDragState({
                isDragging: false,
                draggedReservation: null,
                dragMode: null,
                previewDates: null,
                targetRoom: null,
                isValidDrop: false,
            });
            return;
        }

        // Apply the changes
        const updates: Partial<Reservation> = {
            checkIn: dragState.previewDates.checkIn,
            checkOut: dragState.previewDates.checkOut,
            roomNumber: dragState.targetRoom || dragState.draggedReservation.roomNumber,
            nights: differenceInDays(
                dragState.previewDates.checkOut,
                dragState.previewDates.checkIn
            ),
        };

        onReservationUpdate(dragState.draggedReservation.id, updates);

        setDragState({
            isDragging: false,
            draggedReservation: null,
            dragMode: null,
            previewDates: null,
            targetRoom: null,
            isValidDrop: false,
        });
    }, [dragState, onReservationUpdate]);

    // Cancel dragging
    const handleDragCancel = useCallback(() => {
        setDragState({
            isDragging: false,
            draggedReservation: null,
            dragMode: null,
            previewDates: null,
            targetRoom: null,
            isValidDrop: false,
        });
    }, []);

    return {
        dragState,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleDragCancel,
        checkConflicts,
        validateRatePlan,
    };
}
