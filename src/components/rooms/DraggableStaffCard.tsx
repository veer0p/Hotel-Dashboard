"use client";

import { useDraggable } from "@dnd-kit/core";
import { StaffCard } from "./StaffCard";
import { HousekeepingStaff } from "@/data/mockHousekeepingData";
import { Box } from "@mui/material";

interface DraggableStaffCardProps {
    staff: HousekeepingStaff;
}

export function DraggableStaffCard({ staff }: DraggableStaffCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: staff.id,
        data: {
            staff,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            sx={{
                cursor: 'grab',
                opacity: isDragging ? 0.5 : 1,
                '&:active': { cursor: 'grabbing' },
            }}
        >
            <StaffCard staff={staff} />
        </Box>
    );
}
