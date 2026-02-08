"use client";

import { Box, Paper, Typography, Checkbox, FormControlLabel, Button, Chip, Divider } from "@mui/material";
import { CleaningTask, getCleaningTasksForRoomType } from "@/data/mockHousekeepingData";
import { Room } from "@/data/mockFloorPlanData";
import { useState, memo, useEffect } from "react";
import { Clock, CheckCircle2, AlertCircle, Camera, X } from "lucide-react";

interface CleaningChecklistProps {
    room: Room;
    onComplete?: (roomId: string) => void;
    onClose?: () => void;
}

const CleaningChecklistComponent = ({ room, onComplete, onClose }: CleaningChecklistProps) => {
    const tasks = getCleaningTasksForRoomType(room.type);
    const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
    const [startTime] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const elapsedMinutes = Math.floor((currentTime.getTime() - startTime.getTime()) / 60000);
    const totalEstimatedTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const completionPercentage = (completedTasks.size / tasks.length) * 100;

    const handleTaskToggle = (taskId: string) => {
        setCompletedTasks(prev => {
            const next = new Set(prev);
            if (next.has(taskId)) {
                next.delete(taskId);
            } else {
                next.add(taskId);
            }
            return next;
        });
    };

    const handleComplete = () => {
        if (completedTasks.size === tasks.length) {
            onComplete?.(room.id);
            onClose?.();
        }
    };

    const groupedTasks = tasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {} as Record<string, CleaningTask[]>);

    const categoryLabels = {
        bedroom: 'Bedroom',
        bathroom: 'Bathroom',
        common: 'Common Areas',
    };

    return (
        <Paper
            elevation={0}
            sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Room {room.number} Cleaning
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                            label={`${completedTasks.size}/${tasks.length} Tasks`}
                            size="small"
                            color={completionPercentage === 100 ? 'success' : 'default'}
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            icon={<Clock size={14} />}
                            label={`${elapsedMinutes}/${totalEstimatedTime} min`}
                            size="small"
                            color={elapsedMinutes > totalEstimatedTime ? 'error' : 'default'}
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                </Box>
                <Button onClick={onClose} sx={{ minWidth: 'auto', p: 0.5, color: 'text.secondary' }}>
                    <X size={20} />
                </Button>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ px: 2, pt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{completionPercentage.toFixed(0)}%</Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden' }}>
                    <Box
                        sx={{
                            height: '100%',
                            width: `${completionPercentage}%`,
                            bgcolor: completionPercentage === 100 ? 'success.main' : 'primary.main',
                            transition: 'width 0.3s ease',
                        }}
                    />
                </Box>
            </Box>

            {/* Task Categories */}
            <Box sx={{ p: 2, flex: 1 }}>
                {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                            {categoryLabels[category as keyof typeof categoryLabels]}
                        </Typography>
                        {categoryTasks.map((task) => (
                            <FormControlLabel
                                key={task.id}
                                control={
                                    <Checkbox
                                        checked={completedTasks.has(task.id)}
                                        onChange={() => handleTaskToggle(task.id)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, width: '100%' }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                textDecoration: completedTasks.has(task.id) ? 'line-through' : 'none',
                                                color: completedTasks.has(task.id) ? 'text.secondary' : 'text.primary',
                                            }}
                                        >
                                            {task.label}
                                        </Typography>
                                        <Chip
                                            label={`${task.estimatedTime}m`}
                                            size="small"
                                            sx={{ height: 20, fontSize: '11px' }}
                                        />
                                    </Box>
                                }
                                sx={{ width: '100%', mb: 1, ml: 0, '& .MuiFormControlLabel-label': { flex: 1 } }}
                            />
                        ))}
                    </Box>
                ))}
            </Box>

            <Divider />

            {/* Actions */}
            <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Camera size={16} />}
                    sx={{ flex: 1, textTransform: 'none' }}
                >
                    Report Issue
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={completionPercentage === 100 ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    disabled={completionPercentage !== 100}
                    onClick={handleComplete}
                    sx={{ flex: 1, textTransform: 'none' }}
                >
                    {completionPercentage === 100 ? 'Complete' : 'Incomplete'}
                </Button>
            </Box>
        </Paper>
    );
};

export const CleaningChecklist = memo(CleaningChecklistComponent);
