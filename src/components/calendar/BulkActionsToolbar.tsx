"use client";

import { Box, Paper, Typography, Button, IconButton, Chip, alpha } from "@mui/material";
import { XMarkIcon, CheckIcon, ArchiveBoxIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

interface BulkActionsToolbarProps {
    selectedIds: string[];
    onClear: () => void;
    onUpdateStatus: (status: string) => void;
    onExport: () => void;
}

export default function BulkActionsToolbar({
    selectedIds,
    onClear,
    onUpdateStatus,
    onExport,
}: BulkActionsToolbarProps) {
    if (selectedIds.length === 0) return null;

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1100,
                display: "flex",
                alignItems: "center",
                gap: 3,
                px: 3,
                py: 1.5,
                borderRadius: 4,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                animation: "slideUp 0.3s ease-out",
                "@keyframes slideUp": {
                    from: { transform: "translate(-50%, 100%)", opacity: 0 },
                    to: { transform: "translate(-50%, 0)", opacity: 1 },
                },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton size="small" onClick={onClear}>
                    <XMarkIcon className="w-5 h-5" />
                </IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {selectedIds.length} Selected
                </Typography>
            </Box>

            <Box sx={{ height: 24, width: 1, bgcolor: "divider" }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<CheckIcon className="w-4 h-4" />}
                    onClick={() => onUpdateStatus("confirmed")}
                    sx={{ fontWeight: 600 }}
                >
                    Confirm All
                </Button>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<ArchiveBoxIcon className="w-4 h-4" />}
                    onClick={() => onUpdateStatus("checked-in")}
                    sx={{ fontWeight: 600 }}
                >
                    Check-in All
                </Button>
                <Button
                    variant="text"
                    size="small"
                    startIcon={<DocumentArrowDownIcon className="w-4 h-4" />}
                    onClick={onExport}
                    sx={{ fontWeight: 600 }}
                >
                    Export CSV
                </Button>
            </Box>
        </Paper>
    );
}
