"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Room, RoomStatus } from "@/data/mockFloorPlanData";
import { Check, Wrench, Sparkles, DoorOpen, Clock, History } from "lucide-react";

interface RoomContextMenuProps {
    room: Room | null;
    anchorPosition: { top: number; left: number } | null;
    onClose: () => void;
    onStatusChange: (roomId: string, newStatus: RoomStatus) => void;
}

export default function RoomContextMenu({
    room,
    anchorPosition,
    onClose,
    onStatusChange,
}: RoomContextMenuProps) {
    if (!room || !anchorPosition) return null;

    const handleStatusChange = (newStatus: RoomStatus) => {
        onStatusChange(room.id, newStatus);
        onClose();
    };

    return (
        <Menu
            open={Boolean(anchorPosition)}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 200,
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    },
                },
            }}
        >
            {/* Room Info Header */}
            <MenuItem disabled>
                <ListItemText
                    primary={`Room ${room.number}`}
                    secondary={room.currentGuest?.name || room.type}
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '14px' }}
                    secondaryTypographyProps={{ fontSize: '12px' }}
                />
            </MenuItem>
            <Divider />

            {/* Status Change Options */}
            {room.status !== 'vacant' && (
                <MenuItem onClick={() => handleStatusChange('vacant')}>
                    <ListItemIcon>
                        <DoorOpen size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Mark as Vacant" />
                </MenuItem>
            )}

            {room.status !== 'dirty' && (
                <MenuItem onClick={() => handleStatusChange('dirty')}>
                    <ListItemIcon>
                        <Sparkles size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Mark as Dirty" />
                </MenuItem>
            )}

            {room.status === 'dirty' && (
                <MenuItem onClick={() => handleStatusChange('vacant')}>
                    <ListItemIcon>
                        <Check size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Mark as Clean" />
                </MenuItem>
            )}

            {room.status !== 'maintenance' && (
                <MenuItem onClick={() => handleStatusChange('maintenance')}>
                    <ListItemIcon>
                        <Wrench size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Block for Maintenance" />
                </MenuItem>
            )}

            <Divider />

            {/* Additional Actions */}
            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <Clock size={18} />
                </ListItemIcon>
                <ListItemText primary="Schedule Cleaning" />
            </MenuItem>

            <MenuItem onClick={onClose}>
                <ListItemIcon>
                    <History size={18} />
                </ListItemIcon>
                <ListItemText primary="View History" />
            </MenuItem>
        </Menu>
    );
}
