"use client";

import { format } from "date-fns";
import { useState } from "react";
import { Box, ToggleButtonGroup, ToggleButton, useTheme, useMediaQuery } from "@mui/material";
import { CalendarIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import MainLayout from "@/layouts/MainLayout";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import TimelineView from "@/components/calendar/TimelineView";
import ResourceView from "@/components/calendar/ResourceView";
import ReservationDetail from "@/components/calendar/ReservationDetail";
import { useCalendarState, Reservation } from "@/lib/hooks/useCalendarState";
import { useCalendarData } from "@/lib/hooks/useCalendarData";
import { useDragDrop, DragMode } from "@/lib/hooks/useDragDrop";
import DragOverlay from "@/components/calendar/DragOverlay";
import QuickBooking from "@/components/calendar/QuickBooking";
import BulkActionsToolbar from "@/components/calendar/BulkActionsToolbar";
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
    MouseSensor
} from "@dnd-kit/core";

export type CalendarViewMode = "day" | "week" | "month" | "resources";

export default function CalendarPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {
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
        setFilters
    } = useCalendarState();

    const { reservations, rooms, isLoading, updateReservation, addReservation } = useCalendarData(selectedDate, viewMode);

    const [mobileView, setMobileView] = useState<"timeline" | "resources">("timeline");
    const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
    const [quickBookingData, setQuickBookingData] = useState<{ checkIn?: Date; roomNumber?: string } | null>(null);

    const dragDropHandlers = useDragDrop(reservations, rooms, updateReservation);

    const handleNewBooking = (initialData?: { checkIn?: Date; roomNumber?: string }) => {
        setQuickBookingData(initialData || null);
        setIsQuickBookingOpen(true);
    };

    const toggleReservationSelection = (id: string) => {
        setSelectedReservationIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleAddReservation = (booking: any) => {
        addReservation(booking);
        setIsQuickBookingOpen(false);
    };

    const handleStatusChange = (id: string, status: Reservation["status"]) => {
        updateReservation(id, { status });
    };

    const handleBulkStatusUpdate = (status: string) => {
        selectedReservationIds.forEach(id => {
            updateReservation(id, { status: status as any });
        });
        setSelectedReservationIds([]);
    };

    const handleBulkExport = () => {
        const selectedData = reservations.filter(res => selectedReservationIds.includes(res.id));
        const csv = [
            ["ID", "Guest", "Room", "Check-in", "Check-out", "Status"],
            ...selectedData.map(res => [
                res.id,
                res.guestName,
                res.roomNumber,
                format(res.checkIn, "yyyy-MM-dd"),
                format(res.checkOut, "yyyy-MM-dd"),
                res.status
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reservations_export_${format(new Date(), "yyyyMMdd")}.csv`;
        a.click();
        setSelectedReservationIds([]);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const { reservation, mode } = active.data.current as { reservation: any; mode: DragMode };
        if (reservation) {
            dragDropHandlers.handleDragStart(reservation, mode || "move");
        }
    };

    const onDragMove = (event: DragMoveEvent) => {
        const { over } = event;
        if (over) {
            // over.id will contain information about the target date and room
            // We'll parse it to get targetDate and targetRoom
            const [type, value1, value2] = String(over.id).split(":");
            if (type === "slot") {
                const targetDate = new Date(value1);
                const targetRoom = value2;
                dragDropHandlers.handleDragMove(targetDate, targetRoom);
            }
        } else {
            dragDropHandlers.handleDragMove();
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        dragDropHandlers.handleDragEnd();
    };

    const onDragCancel = () => {
        dragDropHandlers.handleDragCancel();
    };

    return (
        <MainLayout>
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
            >
                <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", bgcolor: "background.default" }}>
                    {/* Header */}
                    <CalendarHeader
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        filters={filters}
                        onFiltersChange={setFilters}
                        onNewBooking={handleNewBooking}
                        selectionMode={selectionMode}
                        onToggleSelectionMode={() => setSelectionMode(prev => prev === "single" ? "multiple" : "single")}
                    />

                    {/* Main Content */}
                    <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                        {isMobile ? (
                            // Mobile: Stacked views with toggle
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", overflow: "hidden" }}>
                                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                                    <ToggleButtonGroup
                                        value={mobileView}
                                        exclusive
                                        onChange={(_, newView) => newView && setMobileView(newView)}
                                        fullWidth
                                        size="small"
                                    >
                                        <ToggleButton value="timeline" aria-label="Timeline view">
                                            <CalendarIcon className="w-5 h-5 mr-2" />
                                            Timeline
                                        </ToggleButton>
                                        <ToggleButton value="resources" aria-label="Resource view">
                                            <ViewColumnsIcon className="w-5 h-5 mr-2" />
                                            Resources
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                                    {mobileView === "timeline" ? (
                                        <TimelineView
                                            reservations={reservations}
                                            viewMode={viewMode}
                                            selectedDate={selectedDate}
                                            onSelectReservation={setSelectedReservation}
                                            onEmptySlotClick={(date) => handleNewBooking({ checkIn: date })}
                                            selectedReservationIds={selectedReservationIds}
                                            selectionMode={selectionMode}
                                            onToggleSelection={toggleReservationSelection}
                                            onStatusChange={handleStatusChange}
                                            isLoading={isLoading}
                                        />
                                    ) : (
                                        <ResourceView
                                            reservations={reservations}
                                            rooms={rooms}
                                            viewMode={viewMode}
                                            selectedDate={selectedDate}
                                            onSelectReservation={setSelectedReservation}
                                            onEmptySlotClick={(date, roomNumber) => handleNewBooking({ checkIn: date, roomNumber })}
                                            selectedReservationIds={selectedReservationIds}
                                            selectionMode={selectionMode}
                                            onToggleSelection={toggleReservationSelection}
                                            onStatusChange={handleStatusChange}
                                            isLoading={isLoading}
                                            dragDropHandlers={dragDropHandlers}
                                        />
                                    )}
                                </Box>
                            </Box>
                        ) : (
                            // Desktop: Split view
                            <>
                                {/* Left Panel: Timeline View (40%) */}
                                <Box
                                    sx={{
                                        width: "40%",
                                        borderRight: 1,
                                        borderColor: "divider",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                >
                                    <TimelineView
                                        reservations={reservations}
                                        viewMode={viewMode}
                                        selectedDate={selectedDate}
                                        onSelectReservation={setSelectedReservation}
                                        onEmptySlotClick={(date) => handleNewBooking({ checkIn: date })}
                                        selectedReservationIds={selectedReservationIds}
                                        selectionMode={selectionMode}
                                        onToggleSelection={toggleReservationSelection}
                                        onStatusChange={handleStatusChange}
                                        isLoading={isLoading}
                                    />
                                </Box>

                                {/* Right Panel: Resource View (60%) */}
                                <Box
                                    sx={{
                                        width: "60%",
                                        overflow: "auto",
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                >
                                    <ResourceView
                                        reservations={reservations}
                                        rooms={rooms}
                                        viewMode={viewMode}
                                        selectedDate={selectedDate}
                                        onSelectReservation={setSelectedReservation}
                                        onEmptySlotClick={(date, roomNumber) => handleNewBooking({ checkIn: date, roomNumber })}
                                        selectedReservationIds={selectedReservationIds}
                                        selectionMode={selectionMode}
                                        onToggleSelection={toggleReservationSelection}
                                        onStatusChange={handleStatusChange}
                                        isLoading={isLoading}
                                        dragDropHandlers={dragDropHandlers}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Reservation Detail Slide-over */}
                    <ReservationDetail
                        reservation={selectedReservation}
                        onClose={() => setSelectedReservation(null)}
                    />

                    {/* Drag Overlay */}
                    <DragOverlay dragState={dragDropHandlers.dragState} />

                    {/* Quick Booking Modal */}
                    <QuickBooking
                        open={isQuickBookingOpen}
                        onClose={() => setIsQuickBookingOpen(false)}
                        onSave={handleAddReservation}
                        initialData={{
                            checkIn: quickBookingData?.checkIn,
                            roomNumber: quickBookingData?.roomNumber
                        }}
                    />

                    {/* Bulk Actions Toolbar */}
                    <BulkActionsToolbar
                        selectedIds={selectedReservationIds}
                        onClear={() => setSelectedReservationIds([])}
                        onUpdateStatus={handleBulkStatusUpdate}
                        onExport={handleBulkExport}
                    />
                </Box>
            </DndContext>
        </MainLayout>
    );
}
