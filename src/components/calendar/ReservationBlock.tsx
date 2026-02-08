"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
    Box,
    Paper,
    Typography,
    Chip,
    alpha,
    Checkbox,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip
} from "@mui/material";
import {
    CheckCircleIcon,
    ArrowPathIcon,
    XMarkIcon,
    ClipboardDocumentIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftOnRectangleIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { Reservation } from "@/lib/hooks/useCalendarState";
import { DragMode } from "@/lib/hooks/useDragDrop";
import { format } from "date-fns";
import { useState } from "react";

interface ReservationBlockProps {
    reservation: Reservation;
    onClick: () => void;
    isDraggable?: boolean;
    isSelected?: boolean;
    selectionMode?: "single" | "multiple";
    onToggleSelection?: (id: string) => void;
    onStatusChange?: (id: string, status: Reservation["status"]) => void;
}

const statusColors = {
    confirmed: { bg: "#3b82f6", text: "#ffffff" },
    "checked-in": { bg: "#8b5cf6", text: "#ffffff" },
    "checked-out": { bg: "#6b7280", text: "#ffffff" },
    tentative: { bg: "#9ca3af", text: "#ffffff" },
    cancelled: { bg: "#ef4444", text: "#ffffff" },
};

interface DraggableHandleProps {
    mode: DragMode;
    reservation: Reservation;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

function DraggableHandle({ mode, reservation, style, children }: DraggableHandleProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `reservation:${reservation.id}:${mode}`,
        data: {
            reservation,
            mode
        }
    });

    const combinedStyle = {
        ...style,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <Box
            ref={setNodeRef}
            style={combinedStyle}
            {...listeners}
            {...attributes}
            sx={{
                width: mode === "move" ? "100%" : "8px",
                height: "100%",
                cursor: mode === "move" ? "move" : "col-resize",
                position: mode === "move" ? "relative" : "absolute",
                left: mode === "extend-start" ? 0 : "auto",
                right: mode === "extend-end" ? 0 : "auto",
                zIndex: mode === "move" ? 1 : 2,
                "&:hover": {
                    bgcolor: mode !== "move" ? alpha("#000", 0.1) : "transparent",
                }
            }}
        >
            {children}
        </Box>
    );
}

export default function ReservationBlock({
    reservation,
    onClick,
    isDraggable = true,
    isSelected = false,
    selectionMode = "single",
    onToggleSelection,
    onStatusChange
}: ReservationBlockProps) {
    const colors = statusColors[reservation.status as keyof typeof statusColors] || statusColors.tentative;
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 }
                : null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleStatusUpdate = (status: Reservation["status"]) => {
        onStatusChange?.(reservation.id, status);
        handleClose();
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelection?.(reservation.id);
    };

    const content = (
        <Box sx={{ p: 2, pl: selectionMode === "multiple" ? 5 : 2, width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {reservation.guestName}
                </Typography>
                {reservation.groupId && (
                    <Tooltip title={`Group: ${reservation.groupId}`} arrow>
                        <Chip
                            icon={<UsersIcon className="w-3 h-3" />}
                            label="Group"
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: 9,
                                fontWeight: 800,
                                bgcolor: alpha("#F59E0B", 0.1),
                                color: "#F59E0B",
                                borderColor: alpha("#F59E0B", 0.2),
                                border: "1px solid",
                                "& .MuiChip-icon": { color: "inherit" }
                            }}
                        />
                    </Tooltip>
                )}
            </Box>
            <Chip
                label={reservation.status}
                size="small"
                sx={{
                    bgcolor: colors.bg,
                    color: colors.text,
                    fontWeight: 600,
                    fontSize: 10,
                    height: 20,
                    textTransform: "capitalize",
                    mb: 1
                }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="caption" color="text.secondary">
                    Room {reservation.roomNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {format(new Date(reservation.checkIn), "MMM d")} - {format(new Date(reservation.checkOut), "MMM d")}
                </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {reservation.ratePlan}
            </Typography>
        </Box>
    );

    const paperSx = {
        position: "relative",
        display: "flex",
        bgcolor: isSelected ? alpha(colors.bg, 0.2) : alpha(colors.bg, 0.1),
        borderLeft: 4,
        borderColor: colors.bg,
        transition: "all 0.2s",
        overflow: "hidden",
        outline: isSelected ? `2px solid ${colors.bg}` : "none",
        outlineOffset: -2,
        "&:hover": {
            bgcolor: alpha(colors.bg, 0.25),
            boxShadow: 2,
        },
    };

    return (
        <Paper
            onContextMenu={handleContextMenu}
            sx={paperSx}
        >
            {selectionMode === "multiple" && (
                <Box
                    onClick={handleCheckboxClick}
                    sx={{
                        position: "absolute",
                        top: 4,
                        left: 8,
                        zIndex: 10,
                    }}
                >
                    <Checkbox
                        size="small"
                        checked={isSelected}
                        sx={{
                            p: 0,
                            color: alpha(colors.bg, 0.5),
                            "&.Mui-checked": {
                                color: colors.bg,
                            },
                        }}
                    />
                </Box>
            )}

            {isDraggable ? (
                <>
                    <DraggableHandle mode="extend-start" reservation={reservation} />
                    <DraggableHandle mode="move" reservation={reservation}>
                        <Box onClick={onClick} sx={{ width: "100%" }}>
                            {content}
                        </Box>
                    </DraggableHandle>
                    <DraggableHandle mode="extend-end" reservation={reservation} />
                </>
            ) : (
                <Box onClick={onClick} sx={{ width: "100%" }}>
                    {content}
                </Box>
            )}

            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Reservation Actions
                    </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => handleStatusUpdate("checked-in")}>
                    <ListItemIcon><ArrowRightOnRectangleIcon className="w-5 h-5 text-indigo-500" /></ListItemIcon>
                    <ListItemText primary="Quick Check-in" />
                </MenuItem>
                <MenuItem onClick={() => handleStatusUpdate("checked-out")}>
                    <ListItemIcon><ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-500" /></ListItemIcon>
                    <ListItemText primary="Check-out" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleStatusUpdate("confirmed")}>
                    <ListItemIcon><CheckCircleIcon className="w-5 h-5 text-green-500" /></ListItemIcon>
                    <ListItemText primary="Confirm Reservation" />
                </MenuItem>
                <MenuItem onClick={() => handleStatusUpdate("cancelled")}>
                    <ListItemIcon><XMarkIcon className="w-5 h-5 text-red-500" /></ListItemIcon>
                    <ListItemText primary="Cancel Reservation" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon><ClipboardDocumentIcon className="w-5 h-5" /></ListItemIcon>
                    <ListItemText primary="Add Housekeeping Note" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <ListItemIcon><ArrowPathIcon className="w-5 h-5" /></ListItemIcon>
                    <ListItemText primary="View Change History" />
                </MenuItem>
            </Menu>
        </Paper>
    );
}
