"use client";

import React, { useEffect } from "react";
import { Command } from "cmdk";
import {
    MagnifyingGlassIcon,
    CalendarIcon,
    Squares2X2Icon,
    UsersIcon,
    TicketIcon,
    BanknotesIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useUIState } from "@/lib/ui-state-context";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useAnnouncer } from "@/lib/hooks/useAnnouncer";

export default function CommandPalette() {
    const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useUIState();
    const router = useRouter();
    const containerRef = useFocusTrap(isCommandPaletteOpen);
    const { announce } = useAnnouncer();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandPaletteOpen(!isCommandPaletteOpen);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

    if (!isCommandPaletteOpen) return null;

    const navigate = (path: string) => {
        const pageName = path === "/" ? "Dashboard" : path.substring(1);
        announce(`Navigating to ${pageName}`);
        router.push(path);
        setIsCommandPaletteOpen(false);
    };

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 sm:px-6"
            onKeyDown={(e) => {
                if (e.key === "Escape") setIsCommandPaletteOpen(false);
            }}
        >
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setIsCommandPaletteOpen(false)}
            />

            <Command
                ref={containerRef as React.RefObject<HTMLDivElement>}
                className="relative w-full max-w-[640px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                label="Command Menu"
                aria-label="Global command palette"
            >
                <div className="flex items-center border-b border-slate-100 px-4" role="search">
                    <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
                    <Command.Input
                        autoFocus
                        placeholder="Type a command or search..."
                        className="w-full h-14 bg-transparent border-none outline-none ring-0 text-slate-900 placeholder-slate-400 text-base"
                    />
                </div>

                <Command.List className="max-h-[50vh] overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="px-4 py-8 text-center text-slate-500">
                        No results found for that search.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="px-2 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Item onSelect={() => navigate("/")} icon={Squares2X2Icon}>Dashboard</Item>
                        <Item onSelect={() => navigate("/calendar")} icon={CalendarIcon}>Calendar</Item>
                        <Item onSelect={() => navigate("/rooms")} icon={Squares2X2Icon}>Room Status</Item>
                        <Item onSelect={() => navigate("/guest-profile")} icon={UsersIcon}>Guest Directory</Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 my-2" />

                    <Command.Group heading="Quick Actions" className="px-2 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Item onSelect={() => console.log("New Booking")} icon={TicketIcon}>New Reservation</Item>
                        <Item onSelect={() => console.log("Reports")} icon={BanknotesIcon}>Financial Reports</Item>
                        <Item onSelect={() => setIsCommandPaletteOpen(false)} icon={Cog6ToothIcon}>Settings</Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-slate-100 my-2" />

                    <Command.Group heading="System" className="px-2 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <Item onSelect={() => console.log("Logout")} icon={ArrowRightOnRectangleIcon}>Log out</Item>
                    </Command.Group>
                </Command.List>

                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500">
                    <div className="flex gap-4">
                        <span><kbd className="font-sans border border-slate-200 bg-white px-1.5 rounded mr-1">↑↓</kbd> Navigate</span>
                        <span><kbd className="font-sans border border-slate-200 bg-white px-1.5 rounded mr-1">↵</kbd> Select</span>
                    </div>
                    <span><kbd className="font-sans border border-slate-200 bg-white px-1.5 rounded mr-1">ESC</kbd> Close</span>
                </div>
            </Command>
        </div>
    );
}

function Item({ children, icon: Icon, onSelect }: { children: React.ReactNode, icon: React.ComponentType<{ className?: string }>, onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-medium cursor-pointer aria-selected:bg-slate-100 aria-selected:text-primary-main transition-colors group"
        >
            <Icon className="w-5 h-5 text-slate-400 group-aria-selected:text-primary-main" />
            {children}
        </Command.Item>
    );
}
