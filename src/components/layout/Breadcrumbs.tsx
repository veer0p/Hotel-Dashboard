"use client";

import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from "@mui/material";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const router = useRouter();

    const pathSegments = pathname.split("/").filter((v) => v);

    if (pathSegments.length === 0) return null;

    return (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <MUIBreadcrumbs
                separator={<ChevronRightIcon className="w-3 h-3 text-slate-400" />}
                aria-label="breadcrumb"
                sx={{
                    "& .MuiBreadcrumbs-li": {
                        display: "flex",
                        alignItems: "center",
                    },
                }}
            >
                <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => router.push("/")}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        color: "text.secondary",
                        fontSize: 13,
                        fontWeight: 500,
                        "&:hover": { color: "primary.main" }
                    }}
                >
                    <HomeIcon className="w-4 h-4 mr-1" />
                    Dashboard
                </Link>

                {pathSegments.map((segment, index) => {
                    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

                    return isLast ? (
                        <Typography
                            key={path}
                            sx={{ color: "text.primary", fontSize: 13, fontWeight: 700 }}
                        >
                            {label}
                        </Typography>
                    ) : (
                        <Link
                            key={path}
                            underline="hover"
                            color="inherit"
                            onClick={() => router.push(path)}
                            sx={{
                                cursor: "pointer",
                                color: "text.secondary",
                                fontSize: 13,
                                fontWeight: 500,
                                "&:hover": { color: "primary.main" }
                            }}
                        >
                            {label}
                        </Link>
                    );
                })}
            </MUIBreadcrumbs>
        </Box>
    );
}
