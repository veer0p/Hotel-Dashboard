import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  children,
}) => {
  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : 'text-destructive';
  };

  const getTrendIcon = () => {
    if (!trend || trend === 'neutral') return '→';
    return trend === 'up' ? '↑' : '↓';
  };

  return (
    <Card className="glass-card card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                <span className={cn("text-sm font-medium", getTrendColor())}>
                  {getTrendIcon()} {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl bg-primary/10",
            iconColor
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {children && (
          <div className="mt-4 pt-4 border-t border-border/50">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
