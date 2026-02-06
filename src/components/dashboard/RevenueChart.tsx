import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RevenueChartProps {
  data: { date: string; revenue: number; bookings: number }[];
  selectedPeriod: '7' | '30' | '90';
  onPeriodChange: (period: '7' | '30' | '90') => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    return `₹${value}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Revenue: </span>
              <span className="font-medium text-primary">
                ₹{payload[0].value.toLocaleString('en-IN')}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Bookings: </span>
              <span className="font-medium text-foreground">{payload[0].payload.bookings}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { value: '7' as const, label: '7 Days' },
    { value: '30' as const, label: '30 Days' },
    { value: '90' as const, label: '90 Days' },
  ];

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant="ghost"
              size="sm"
              onClick={() => onPeriodChange(period.value)}
              className={cn(
                "text-xs h-7 px-3",
                selectedPeriod === period.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
