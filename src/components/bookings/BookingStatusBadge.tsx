import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/types/hotel';
import { cn } from '@/lib/utils';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmed',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  'checked-in': {
    label: 'Checked In',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  'checked-out': {
    label: 'Checked Out',
    className: 'bg-muted text-muted-foreground border-muted-foreground/30',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default BookingStatusBadge;
