"use client";

import React, { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useUIState } from "@/lib/ui-state-context";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { themeMode } = useUIState();

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: themeMode,
                primary: {
                    main: "#3B82F6", // Blue 500
                    light: "#60A5FA",
                    dark: "#2563EB",
                },
                secondary: {
                    main: "#6366F1", // Indigo 500
                },
                background: {
                    default: themeMode === "light" ? "#F8FAFC" : "#0f172a",
                    paper: themeMode === "light" ? "#FFFFFF" : "#1e293b",
                },
                text: {
                    primary: themeMode === "light" ? "#0f172a" : "#f1f5f9",
                    secondary: themeMode === "light" ? "#64748b" : "#94a3b8",
                },
            },
            typography: {
                fontFamily: "var(--font-inter), sans-serif",
                h1: { fontWeight: 800 },
                h2: { fontWeight: 800 },
                h3: { fontWeight: 700 },
                h4: { fontWeight: 700 },
                h5: { fontWeight: 600 },
                h6: { fontWeight: 600 },
                subtitle1: { fontWeight: 600 },
                subtitle2: { fontWeight: 600 },
                body1: { fontSize: "0.9375rem" },
                body2: { fontSize: "0.875rem" },
            },
            shape: {
                borderRadius: 12,
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: "none",
                        },
                    },
                },
            },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 641,
                    md: 769,
                    lg: 1025,
                    xl: 1281,
                },
            },
        });
    }, [themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
