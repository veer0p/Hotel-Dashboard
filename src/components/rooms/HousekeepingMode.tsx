"use client";

import { Box, Typography, Button, IconButton, Paper, Divider, Stack } from "@mui/material";
import { HousekeepingStaff, mockHousekeepingStaff } from "@/data/mockHousekeepingData";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent
} from "@dnd-kit/core";
import { DraggableStaffCard } from "./DraggableStaffCard";
import { StaffCard } from "./StaffCard";
import { DroppableRoomCard } from "./DroppableRoomCard";
import { mockRoomsData, Room } from "@/data/mockFloorPlanData";
import { useState, useCallback, memo } from "react";
import { ArrowLeft, Plus, Users, Filter } from "lucide-react";

interface HousekeepingModeProps {
    onBack: () => void;
    onStaffClick?: (staff: HousekeepingStaff) => void;
}

const HousekeepingModeComponent = ({ onBack, onStaffClick }: HousekeepingModeProps) => {
    const [staffData, setStaffData] = useState<HousekeepingStaff[]>(mockHousekeepingStaff);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Use rooms that need cleaning
    const dirtyRooms = mockRoomsData.filter((r: Room) => r.status === 'dirty').slice(0, 12);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const staffId = active.id as string;
            const roomId = over.id as string;

            setStaffData(prev => prev.map(staff => {
                if (staff.id === staffId) {
                    // Add room if not already assigned
                    if (!staff.assignedRooms.includes(roomId)) {
                        return { ...staff, assignedRooms: [...staff.assignedRooms, roomId] };
                    }
                }
                return staff;
            }));

            console.log(`Assigned ${staffId} to room ${roomId}`);
        }
    }, []);

    const activeStaff = activeId ? staffData.find(s => s.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Box>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={onBack} size="small" sx={{ bgcolor: 'action.hover' }}>
                            <ArrowLeft size={20} />
                        </IconButton>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Housekeeping Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Drag staff to rooms to assign cleaning tasks
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" startIcon={<Plus size={18} />} size="small">
                            Add Staff
                        </Button>
                        <Button variant="contained" color="primary" size="small">
                            Morning Shift
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' }, gap: 3 }}>
                    {/* Left column: Staff List */}
                    <Box>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.default' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Users size={18} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        Staff Pool
                                    </Typography>
                                </Box>
                                <IconButton size="small"><Filter size={16} /></IconButton>
                            </Box>

                            <Stack spacing={2}>
                                {staffData.map(staff => (
                                    <DraggableStaffCard key={staff.id} staff={staff} />
                                ))}
                            </Stack>
                        </Paper>
                    </Box>

                    {/* Right column: Assignment Board */}
                    <Box>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                minHeight: 500,
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
                                Unassigned Dirty Rooms
                            </Typography>

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                gap: 2
                            }}>
                                {dirtyRooms.map((room: Room) => {
                                    const assignedStaff = staffData.find(s => s.assignedRooms.includes(room.id));
                                    return (
                                        <DroppableRoomCard
                                            key={room.id}
                                            room={room}
                                            assignedStaff={assignedStaff}
                                        />
                                    );
                                })}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>

            <DragOverlay dropAnimation={{
                ...defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: '0.4',
                        },
                    },
                }),
            }}>
                {activeStaff ? (
                    <Box sx={{ width: 300 }}>
                        <StaffCard staff={activeStaff} />
                    </Box>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export const HousekeepingMode = memo(HousekeepingModeComponent);
