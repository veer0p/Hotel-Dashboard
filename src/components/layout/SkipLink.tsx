"use client";

import React from "react";
import { Box } from "@mui/material";

export default function SkipLink() {
    return (
        <Box
            component="a"
            href="#main-content"
            sx={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                "&:focus": {
                    position: "fixed",
                    top: 16,
                    left: 16,
                    width: "auto",
                    height: "auto",
                    overflow: "visible",
                    zIndex: 9999,
                    bgcolor: "primary.main",
                    color: "white",
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    boxShadow: "0 0 0 2px white, 0 0 0 4px #3B82F6",
                    outline: "none",
                },
            }}
        >
            Skip to main content
        </Box>
    );
}
