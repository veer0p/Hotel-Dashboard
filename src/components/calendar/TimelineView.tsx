import { Box, Typography, Paper, Skeleton, alpha } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { Reservation } from "@/lib/hooks/useCalendarState";
import { CalendarViewMode } from "@/lib/hooks/useCalendarState";
import { format, isSameDay, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import ReservationBlock from "./ReservationBlock";

interface TimelineViewProps {
    reservations: Reservation[];
    viewMode: CalendarViewMode;
    selectedDate: Date;
    onSelectReservation: (reservation: Reservation | null) => void;
    onEmptySlotClick?: (date: Date) => void;
    selectedReservationIds?: string[];
    selectionMode?: "single" | "multiple";
    onToggleSelection?: (id: string) => void;
    onStatusChange?: (id: string, status: Reservation["status"]) => void;
    isLoading: boolean;
}

interface DroppableDateSectionProps {
    date: Date;
    children: React.ReactNode;
}

function DroppableDateSection({ date, children }: DroppableDateSectionProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `slot:${date.toISOString()}`,
    });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: isOver ? alpha("#3b82f6", 0.1) : "transparent",
                transition: "background-color 0.2s",
                border: isOver ? "2px dashed" : "2px solid transparent",
                borderColor: "primary.main",
            }}
        >
            {children}
        </Box>
    );
}

export default function TimelineView({
    reservations,
    viewMode,
    selectedDate,
    onSelectReservation,
    onEmptySlotClick,
    selectedReservationIds = [],
    selectionMode = "single",
    onToggleSelection,
    onStatusChange,
    isLoading,
}: TimelineViewProps) {
    const getDateRange = () => {
        switch (viewMode) {
            case "day":
                return [selectedDate];
            case "week":
            case "resources":
                return eachDayOfInterval({
                    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
                });
            case "month":
                return eachDayOfInterval({
                    start: startOfMonth(selectedDate),
                    end: endOfMonth(selectedDate),
                });
        }
    };

    const dates = getDateRange();

    const getReservationsForDate = (date: Date) => {
        return reservations.filter(res =>
            isSameDay(res.checkIn, date) ||
            (res.checkIn < date && res.checkOut > date)
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: "background.default" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Timeline View
            </Typography>

            {dates.map((date) => {
                const dayReservations = getReservationsForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                    <DroppableDateSection key={date.toISOString()} date={date}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 1.5,
                                pb: 1,
                                borderBottom: 2,
                                borderColor: isToday ? "primary.main" : "divider",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    color: isToday ? "primary.main" : "text.primary",
                                }}
                            >
                                {format(date, "EEE, MMM d")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {dayReservations.length} reservation{dayReservations.length !== 1 ? "s" : ""}
                            </Typography>
                        </Box>

                        {dayReservations.length === 0 ? (
                            <Paper
                                onClick={() => onEmptySlotClick?.(date)}
                                sx={{
                                    p: 3,
                                    textAlign: "center",
                                    bgcolor: "action.hover",
                                    border: "2px dashed",
                                    borderColor: "divider",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        bgcolor: "action.selected",
                                        borderColor: "primary.main",
                                    },
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    No reservations for this day. Click to create one.
                                </Typography>
                            </Paper>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {dayReservations.map((reservation) => (
                                    <ReservationBlock
                                        key={reservation.id}
                                        reservation={reservation}
                                        onClick={() => onSelectReservation(reservation)}
                                        isSelected={selectedReservationIds.includes(reservation.id)}
                                        selectionMode={selectionMode}
                                        onToggleSelection={onToggleSelection}
                                        onStatusChange={onStatusChange}
                                    />
                                ))}
                            </Box>
                        )}
                    </DroppableDateSection>
                );
            })}
        </Box>
    );
}
