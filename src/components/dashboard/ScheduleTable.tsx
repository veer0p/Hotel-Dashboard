"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    useTheme,
    useMediaQuery,
    Box,
    Typography,
} from "@mui/material";
import { ScheduleItem } from "@/data/mockDashboardData";

interface ScheduleTableProps {
    scheduleItems: ScheduleItem[];
    onActionClick?: (item: ScheduleItem) => void;
}

const actionColors = {
    'check-in': 'success',
    'check-out': 'primary',
    'maintenance': 'error',
    'prepare': 'warning',
} as const;

export default function ScheduleTable({ scheduleItems, onActionClick }: ScheduleTableProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {scheduleItems.map((item, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                    {item.guest}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.time}
                                </Typography>
                            </Box>
                            <Chip
                                label={item.room}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            fullWidth
                            color={actionColors[item.action]}
                            onClick={() => onActionClick?.(item)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 1.5,
                            }}
                        >
                            {item.actionLabel}
                        </Button>
                    </Paper>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Time</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Guest</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '14px' }}>Room</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '14px' }} align="right">
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scheduleItems.map((item, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': { bgcolor: 'grey.50' },
                            }}
                        >
                            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                {item.time}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>{item.guest}</TableCell>
                            <TableCell>
                                <Chip
                                    label={item.room}
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: 'primary.50',
                                        color: 'primary.main',
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    size="small"
                                    color={actionColors[item.action]}
                                    onClick={() => onActionClick?.(item)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 1.5,
                                        px: 2,
                                    }}
                                >
                                    {item.actionLabel}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
