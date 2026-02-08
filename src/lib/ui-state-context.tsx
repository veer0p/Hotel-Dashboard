"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UIStateContextType {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: (expanded: boolean) => void;
    isCommandPaletteOpen: boolean;
    setIsCommandPaletteOpen: (open: boolean) => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
    isNotificationsOpen: boolean;
    setIsNotificationsOpen: (open: boolean) => void;
    themeMode: "light" | "dark";
    setThemeMode: (mode: "light" | "dark") => void;
    activeContext: string | null;
    setActiveContext: (context: string | null) => void;
    property: string;
    setProperty: (property: string) => void;
    isShortcutHelpOpen: boolean;
    setIsShortcutHelpOpen: (open: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);

    // Initialize theme from localStorage or system preference
    const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("themeMode") as "light" | "dark";
            if (savedTheme) return savedTheme;
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        }
        return "light";
    });

    const [activeContext, setActiveContext] = useState<string | null>(null);
    const [property, setProperty] = useState("Main Hotel");

    // Persist theme changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("themeMode", themeMode);
            if (themeMode === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [themeMode]);

    return (
        <UIStateContext.Provider
            value={{
                isSidebarExpanded,
                setIsSidebarExpanded,
                isCommandPaletteOpen,
                setIsCommandPaletteOpen,
                isDrawerOpen,
                setIsDrawerOpen,
                isNotificationsOpen,
                setIsNotificationsOpen,
                themeMode,
                setThemeMode,
                activeContext,
                setActiveContext,
                property,
                setProperty,
                isShortcutHelpOpen,
                setIsShortcutHelpOpen,
            }}
        >
            {children}
        </UIStateContext.Provider>
    );
}

export function useUIState() {
    const context = useContext(UIStateContext);
    if (context === undefined) {
        throw new Error("useUIState must be used within a UIStateProvider");
    }
    return context;
}
