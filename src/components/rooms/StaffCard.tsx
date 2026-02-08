"use client";

import { Box, Paper, Typography, Avatar, Chip, LinearProgress } from "@mui/material";
import { HousekeepingStaff } from "@/data/mockHousekeepingData";
import { memo } from "react";
import { User, CheckCircle2, Clock } from "lucide-react";

interface StaffCardProps {
  staff: HousekeepingStaff;
  onDrop?: (staffId: string, roomId: string) => void;
}

const statusConfig = {
  active: { color: '#10B981', label: 'Active' },
  break: { color: '#F59E0B', label: 'On Break' },
  offline: { color: '#6B7280', label: 'Offline' },
};

const StaffCardComponent = ({ staff, onDrop }: StaffCardProps) => {
  const config = statusConfig[staff.status];
  const workloadPercentage = (staff.assignedRooms.length / 10) * 100; // Assume max 10 rooms per staff
  const workloadColor = workloadPercentage > 80 ? 'error' : workloadPercentage > 50 ? 'warning' : 'success';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      {/* Staff Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: config.color,
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {staff.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {staff.name}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            sx={{
              height: 18,
              fontSize: '11px',
              fontWeight: 600,
              bgcolor: config.color,
              color: '#ffffff',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Assigned Rooms */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Assigned Rooms
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {staff.assignedRooms.length}/10
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={workloadPercentage}
            color={workloadColor}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* Completed Today */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle2 size={14} color="#10B981" />
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            Completed Today
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {staff.completedToday}
          </Typography>
        </Box>

        {/* Average Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={14} color="#8B5CF6" />
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            Avg. Time
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {staff.averageTime}min
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export const StaffCard = memo(StaffCardComponent);
