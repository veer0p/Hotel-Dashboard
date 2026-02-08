"use client";

import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { Check, Wrench, History, XCircle } from "lucide-react";

interface RoomContextMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    roomStatus: 'vacant' | 'occupied' | 'dirty' | 'maintenance';
    onMarkClean: () => void;
    onBlockMaintenance: () => void;
    onViewHistory: () => void;
}

export default function RoomContextMenu({
    anchorEl,
    open,
    onClose,
    roomStatus,
    onMarkClean,
    onBlockMaintenance,
    onViewHistory,
}: RoomContextMenuProps) {
    const handleMarkClean = () => {
        onMarkClean();
        onClose();
    };

    const handleBlockMaintenance = () => {
        onBlockMaintenance();
        onClose();
    };

    const handleViewHistory = () => {
        onViewHistory();
        onClose();
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                },
            }}
        >
            {(roomStatus === 'dirty' || roomStatus === 'maintenance') && (
                <MenuItem onClick={handleMarkClean}>
                    <ListItemIcon>
                        <Check size={18} />
                    </ListItemIcon>
                    <ListItemText>Mark as Clean</ListItemText>
                </MenuItem>
            )}

            {roomStatus !== 'maintenance' && (
                <MenuItem onClick={handleBlockMaintenance}>
                    <ListItemIcon>
                        <Wrench size={18} />
                    </ListItemIcon>
                    <ListItemText>Block for Maintenance</ListItemText>
                </MenuItem>
            )}

            <Divider />

            <MenuItem onClick={handleViewHistory}>
                <ListItemIcon>
                    <History size={18} />
                </ListItemIcon>
                <ListItemText>View History</ListItemText>
            </MenuItem>
        </Menu>
    );
}
