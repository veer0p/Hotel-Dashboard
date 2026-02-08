"use client";

import React, { Component, ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                        bgcolor: "background.default",
                        p: 3,
                    }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            maxWidth: 500,
                            p: 4,
                            textAlign: "center",
                        }}
                    >
                        <ExclamationTriangleIcon className="w-16 h-16 text-error-main mx-auto mb-3" />
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            We encountered an unexpected error. Please try refreshing the page.
                        </Typography>
                        {this.state.error && (
                            <Box
                                sx={{
                                    bgcolor: "grey.100",
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 3,
                                    textAlign: "left",
                                }}
                            >
                                <Typography variant="caption" sx={{ fontFamily: "monospace", wordBreak: "break-word" }}>
                                    {this.state.error.message}
                                </Typography>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            onClick={this.handleReset}
                            sx={{ px: 4 }}
                        >
                            Reload Page
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}
