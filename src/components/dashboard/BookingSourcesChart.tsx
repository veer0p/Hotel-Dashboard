import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingSourceData } from '@/types/hotel';

interface BookingSourcesChartProps {
  data: BookingSourceData[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

const BookingSourcesChart: React.FC<BookingSourcesChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{item.source}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Bookings: </span>
            <span className="font-medium">{item.count}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Percentage: </span>
            <span className="font-medium">{item.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Booking Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={item.source} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground">{item.source}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSourcesChart;
