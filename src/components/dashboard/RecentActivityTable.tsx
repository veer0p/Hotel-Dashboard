import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RecentActivity as RecentActivityType, BookingStatus } from '@/types/hotel';
import { Clock, ArrowRight } from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivityType[];
  onViewAll?: () => void;
}

const getStatusBadgeClass = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return 'badge-confirmed';
    case 'pending':
      return 'badge-pending';
    case 'checked-in':
      return 'badge-checked-in';
    case 'checked-out':
      return 'badge-checked-out';
    case 'cancelled':
      return 'badge-cancelled';
    default:
      return 'badge-pending';
  }
};

const formatStatus = (status: BookingStatus) => {
  return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const RecentActivityTable: React.FC<RecentActivityProps> = ({ activities, onViewAll }) => {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-primary hover:text-primary/80"
        >
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Guest
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Room
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Action
                </th>
                <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-border/30 table-row-hover"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {activity.time}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-sm font-medium text-foreground">
                      {activity.guestName}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {activity.roomNumber}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getStatusBadgeClass(activity.status)
                    )}>
                      {formatStatus(activity.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
