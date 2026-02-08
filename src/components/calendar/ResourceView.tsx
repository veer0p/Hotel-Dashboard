import { Box, Typography, Paper, Skeleton, alpha, Checkbox } from "@mui/material";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Reservation } from "@/lib/hooks/useCalendarState";
import { Room } from "@/lib/hooks/useCalendarData";
import { CalendarViewMode } from "@/lib/hooks/useCalendarState";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, differenceInDays, isSameDay, startOfDay, endOfDay } from "date-fns";
import { useMemo } from "react";

interface ResourceViewProps {
    reservations: Reservation[];
    rooms: Room[];
    viewMode: CalendarViewMode;
    selectedDate: Date;
    onSelectReservation: (reservation: Reservation | null) => void;
    onEmptySlotClick?: (date: Date, roomNumber: string) => void;
    selectedReservationIds?: string[];
    selectionMode?: "single" | "multiple";
    onToggleSelection?: (id: string) => void;
    onStatusChange?: (id: string, status: Reservation["status"]) => void;
    isLoading: boolean;
    dragDropHandlers?: ReturnType<typeof import("@/lib/hooks/useDragDrop").useDragDrop>;
}

const statusColors = {
    confirmed: "#3b82f6",
    "checked-in": "#8b5cf6",
    "checked-out": "#6b7280",
    tentative: "#9ca3af",
    cancelled: "#ef4444",
};

interface DraggableReservationProps {
    reservation: Reservation;
    position: { left: string; width: string };
    color: string;
    isSelected?: boolean;
    selectionMode?: "single" | "multiple";
    onToggleSelection?: (id: string) => void;
    onStatusChange?: (id: string, status: Reservation["status"]) => void;
    onSelect: (reservation: Reservation) => void;
}

function DraggableReservation({
    reservation,
    position,
    color,
    isSelected = false,
    selectionMode = "single",
    onToggleSelection,
    onStatusChange,
    onSelect
}: DraggableReservationProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `reservation:${reservation.id}`,
        data: {
            reservation,
            mode: "move" as const
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : 1,
        left: position.left,
        width: position.width,
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelection?.(reservation.id);
    };

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => onSelect(reservation)}
            sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                height: 40,
                bgcolor: isSelected ? alpha(color, 1) : alpha(color, 0.9),
                color: "white",
                px: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: selectionMode === "multiple" ? "flex-start" : "center",
                gap: 0.5,
                cursor: "pointer",
                borderRadius: 1,
                overflow: "hidden",
                transition: "background-color 0.2s, transform 0.2s",
                outline: isSelected ? `2px solid white` : "none",
                outlineOffset: -2,
                "&:hover": {
                    bgcolor: color,
                    transform: "translateY(-50%) scale(1.02)",
                    zIndex: 2,
                    boxShadow: 3,
                },
            }}
        >
            {selectionMode === "multiple" && (
                <Checkbox
                    size="small"
                    checked={isSelected}
                    onClick={handleCheckboxClick}
                    sx={{
                        p: 0,
                        color: alpha("#fff", 0.7),
                        "&.Mui-checked": {
                            color: "#fff",
                        },
                    }}
                />
            )}
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 700,
                    fontSize: 10,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {reservation.guestName}
            </Typography>
        </Paper>
    );
}

interface DroppableSlotProps {
    id: string;
    onClick?: () => void;
    children: React.ReactNode;
}

function DroppableSlot({ id, onClick, children }: DroppableSlotProps) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <Box
            ref={setNodeRef}
            onClick={onClick}
            sx={{
                flex: 1,
                position: "relative",
                height: "100%",
                cursor: onClick ? "cell" : "default",
                bgcolor: isOver ? alpha("#3b82f6", 0.1) : "transparent",
                transition: "background-color 0.2s",
                "&:hover": {
                    bgcolor: onClick ? alpha("#3b82f6", 0.05) : "transparent",
                }
            }}
        >
            {children}
        </Box>
    );
}

export default function ResourceView({
    reservations,
    rooms,
    viewMode,
    selectedDate,
    onSelectReservation,
    onEmptySlotClick,
    selectedReservationIds = [],
    selectionMode = "single",
    onToggleSelection,
    onStatusChange,
    isLoading,
    dragDropHandlers,
}: ResourceViewProps) {
    const dateRange = useMemo(() => {
        return eachDayOfInterval({
            start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
            end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        });
    }, [selectedDate]);

    const getReservationsForRoom = (roomNumber: string) => {
        return reservations.filter(res => res.roomNumber === roomNumber);
    };

    const calculatePosition = (checkIn: Date, checkOut: Date) => {
        const startDate = startOfDay(dateRange[0]);
        const endDate = endOfDay(dateRange[dateRange.length - 1]);
        const dayWidth = 100 / dateRange.length;

        // Clip the reservation to the currently visible date range
        const effectiveStart = checkIn < startDate ? startDate : checkIn;
        const effectiveEnd = checkOut > endDate ? endDate : checkOut;

        const startOffset = differenceInDays(effectiveStart, startDate);
        const duration = differenceInDays(effectiveEnd, effectiveStart);

        // If the reservation is completely outside the range, don't show it (or show with 0 width)
        if (checkOut <= startDate || checkIn >= endDate) {
            return { left: "0%", width: "0%" };
        }

        return {
            left: `${Math.max(0, startOffset * dayWidth)}%`,
            width: `${Math.max(0, duration * dayWidth)}%`,
        };
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, bgcolor: "background.default", height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Resource View (Gantt Chart)
            </Typography>

            {/* Date Headers */}
            <Box sx={{ display: "flex", mb: 2, pl: "120px" }}>
                {dateRange.map((date) => {
                    const isToday = isSameDay(date, new Date());
                    return (
                        <Box
                            key={date.toISOString()}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                pb: 1,
                                borderBottom: 2,
                                borderColor: isToday ? "primary.main" : "divider",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    color: isToday ? "primary.main" : "text.secondary",
                                }}
                            >
                                {format(date, "EEE")}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: isToday ? "primary.main" : "text.secondary",
                                }}
                            >
                                {format(date, "d")}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Room Rows */}
            <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
                {rooms.slice(0, 20).map((room) => {
                    const roomReservations = getReservationsForRoom(room.number);

                    return (
                        <Box
                            key={room.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                minHeight: 60,
                                borderBottom: 1,
                                borderColor: "divider",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        >
                            {/* Room Label */}
                            <Box
                                sx={{
                                    width: 120,
                                    px: 2,
                                    borderRight: 1,
                                    borderColor: "divider",
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Room {room.number}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {room.type}
                                </Typography>
                            </Box>

                            {/* Timeline Grid */}
                            <Box sx={{ flex: 1, display: "flex", height: 60, position: "relative", overflow: "hidden" }}>
                                {dateRange.map((date, index) => (
                                    <DroppableSlot
                                        key={date.toISOString()}
                                        id={`slot:${date.toISOString()}:${room.number}`}
                                        onClick={() => onEmptySlotClick?.(date, room.number)}
                                    >
                                        <Box
                                            sx={{
                                                height: "100%",
                                                borderRight: index < dateRange.length - 1 ? 1 : 0,
                                                borderColor: "divider",
                                            }}
                                        />
                                    </DroppableSlot>
                                ))}

                                {/* Reservation Blocks */}
                                {roomReservations.map((reservation) => {
                                    const position = calculatePosition(reservation.checkIn, reservation.checkOut);
                                    const color = statusColors[reservation.status as keyof typeof statusColors];

                                    return (
                                        <DraggableReservation
                                            key={reservation.id}
                                            reservation={reservation}
                                            position={position}
                                            color={color}
                                            isSelected={selectedReservationIds.includes(reservation.id)}
                                            selectionMode={selectionMode}
                                            onToggleSelection={onToggleSelection}
                                            onStatusChange={onStatusChange}
                                            onSelect={onSelectReservation}
                                        />
                                    );
                                })}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
