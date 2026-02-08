"use client";

import { Box, Paper, Typography, alpha } from "@mui/material";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface DropZoneProps {
    isActive: boolean;
    isValid: boolean;
    date?: Date;
    roomNumber?: string;
    onDrop: () => void;
    children?: React.ReactNode;
}

export default function DropZone({
    isActive,
    isValid,
    date,
    roomNumber,
    onDrop,
    children,
}: DropZoneProps) {
    if (!isActive) {
        return <>{children}</>;
    }

    return (
        <Box
            onDrop={(e) => {
                e.preventDefault();
                if (isValid) {
                    onDrop();
                }
            }}
            onDragOver={(e) => {
                e.preventDefault();
            }}
            sx={{
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    border: 3,
                    borderStyle: "dashed",
                    borderColor: isValid ? "success.main" : "error.main",
                    borderRadius: 2,
                    bgcolor: isValid
                        ? alpha("#10b981", 0.1)
                        : alpha("#ef4444", 0.1),
                    pointerEvents: "none",
                    zIndex: 10,
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                },
            }}
        >
            {children}

            {/* Drop Indicator */}
            <Paper
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    p: 2,
                    zIndex: 11,
                    bgcolor: isValid ? "success.main" : "error.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    boxShadow: 3,
                    pointerEvents: "none",
                }}
            >
                {isValid ? (
                    <CheckCircleIcon className="w-5 h-5" />
                ) : (
                    <ExclamationTriangleIcon className="w-5 h-5" />
                )}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isValid ? "Drop to assign" : "Invalid drop"}
                </Typography>
            </Paper>
        </Box>
    );
}
