"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    Button,
    TextField,
    MenuItem,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    alpha,
} from "@mui/material";
import {
    WrenchIcon,
    AlertCircleIcon,
    CheckCircle2Icon,
    ClockIcon,
    UserIcon,
} from "lucide-react";

interface MaintenanceIssue {
    id: string;
    type: string;
    description: string;
    status: "pending" | "in-progress" | "resolved";
    priority: "low" | "medium" | "high" | "urgent";
    reportedAt: string;
    reportedBy: string;
    assignedTo?: string;
}

const mockIssues: MaintenanceIssue[] = [
    {
        id: "1",
        type: "Plumbing",
        description: "Slow drain in the bathroom sink",
        status: "pending",
        priority: "medium",
        reportedAt: "2026-02-08T10:00:00Z",
        reportedBy: "Housekeeping (Sarah)",
    },
    {
        id: "2",
        type: "Electrical",
        description: "Flickering light in the entryway",
        status: "resolved",
        priority: "low",
        reportedAt: "2026-02-05T14:30:00Z",
        reportedBy: "Guest (Room 302)",
        assignedTo: "John (Maintenance)",
    }
];

interface MaintenanceLogProps {
    roomNumber: string;
}

export default function MaintenanceLog({ roomNumber }: MaintenanceLogProps) {
    const [issues, setIssues] = useState<MaintenanceIssue[]>(mockIssues);
    const [reportMode, setReportMode] = useState(false);
    const [newIssue, setNewIssue] = useState({
        type: "General",
        description: "",
        priority: "medium" as MaintenanceIssue["priority"],
    });

    const handleReportSubmit = () => {
        const issue: MaintenanceIssue = {
            id: Math.random().toString(36).substr(2, 9),
            ...newIssue,
            status: "pending",
            reportedAt: new Date().toISOString(),
            reportedBy: "Front Desk Manager",
        };
        setIssues([issue, ...issues]);
        setReportMode(false);
        setNewIssue({ type: "General", description: "", priority: "medium" });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent": return "#EF4444";
            case "high": return "#F59E0B";
            case "medium": return "#3B82F6";
            default: return "#10B981";
        }
    };

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Maintenance History
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<WrenchIcon size={16} />}
                    onClick={() => setReportMode(!reportMode)}
                    sx={{ textTransform: "none" }}
                >
                    {reportMode ? "Cancel" : "Report Issue"}
                </Button>
            </Box>

            {reportMode && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: alpha("#3B82F6", 0.05),
                        border: "1px solid",
                        borderColor: alpha("#3B82F6", 0.2),
                        borderRadius: 2
                    }}
                >
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>New Maintenance Request</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            select
                            label="Issue Category"
                            size="small"
                            fullWidth
                            value={newIssue.type}
                            onChange={(e) => setNewIssue({ ...newIssue, type: e.target.value })}
                        >
                            <MenuItem value="Plumbing">Plumbing</MenuItem>
                            <MenuItem value="Electrical">Electrical</MenuItem>
                            <MenuItem value="HVAC">HVAC</MenuItem>
                            <MenuItem value="General">General/Other</MenuItem>
                        </TextField>

                        <TextField
                            label="Description"
                            multiline
                            rows={2}
                            size="small"
                            fullWidth
                            value={newIssue.description}
                            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                        />

                        <TextField
                            select
                            label="Priority"
                            size="small"
                            fullWidth
                            value={newIssue.priority}
                            onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="urgent">Urgent</MenuItem>
                        </TextField>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleReportSubmit}
                            disabled={!newIssue.description}
                            sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                            Submit Report
                        </Button>
                    </Box>
                </Paper>
            )}

            <List disablePadding>
                {issues.map((issue, index) => (
                    <React.Fragment key={issue.id}>
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                px: 0,
                                py: 2,
                                flexDirection: "column",
                                gap: 1
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {issue.status === "resolved" ? (
                                        <CheckCircle2Icon size={16} className="text-green-500" />
                                    ) : (
                                        <AlertCircleIcon size={16} className={issue.priority === "urgent" ? "text-red-500" : "text-blue-500"} />
                                    )}
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {issue.type}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={issue.priority.toUpperCase()}
                                    size="small"
                                    sx={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                        height: 20,
                                        bgcolor: alpha(getPriorityColor(issue.priority), 0.1),
                                        color: getPriorityColor(issue.priority),
                                        borderColor: alpha(getPriorityColor(issue.priority), 0.2),
                                        border: "1px solid"
                                    }}
                                />
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                                {issue.description}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 3, mt: 0.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <ClockIcon size={12} className="text-slate-400" />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(issue.reportedAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <UserIcon size={12} className="text-slate-400" />
                                    <Typography variant="caption" color="text.secondary">
                                        {issue.reportedBy}
                                    </Typography>
                                </Box>
                            </Box>

                            {issue.assignedTo && (
                                <Box sx={{ ml: 3, mt: 1 }}>
                                    <Chip
                                        icon={<UserIcon size={12} />}
                                        label={`Assigned to: ${issue.assignedTo}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ height: 22, fontSize: 11 }}
                                    />
                                </Box>
                            )}
                        </ListItem>
                        {index < issues.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}
