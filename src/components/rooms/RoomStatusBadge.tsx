import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RoomStatus } from '@/types/hotel';
import { cn } from '@/lib/utils';

interface RoomStatusBadgeProps {
  status: RoomStatus;
  className?: string;
}

const statusConfig: Record<RoomStatus, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  occupied: {
    label: 'Occupied',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
  cleaning: {
    label: 'Cleaning',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-muted text-muted-foreground border-muted-foreground/30',
  },
};

const RoomStatusBadge: React.FC<RoomStatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default RoomStatusBadge;
