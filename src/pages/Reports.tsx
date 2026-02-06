import React, { useState } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { Download, TrendingUp, TrendingDown, Calendar, DollarSign, Users, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockRooms, mockBookings, mockBookingSources } from '@/data/mockData';
import { cn } from '@/lib/utils';

type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom';

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

// Generate mock revenue data
const generateRevenueData = () => {
  return Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      revenue: Math.floor(Math.random() * 150000) + 50000,
      bookings: Math.floor(Math.random() * 15) + 5,
    };
  });
};

// Generate occupancy data
const generateOccupancyData = () => {
  const types = ['standard', 'deluxe', 'premium', 'suite', 'penthouse'];
  return types.map((type) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    occupied: Math.floor(Math.random() * 80) + 20,
    available: Math.floor(Math.random() * 30) + 10,
  }));
};

// Generate stay duration data
const generateStayData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i);
    return {
      month: format(date, 'MMM'),
      avgDays: (Math.random() * 2 + 2).toFixed(1),
    };
  });
};

const revenueData = generateRevenueData();
const occupancyData = generateOccupancyData();
const stayData = generateStayData();

const COLORS = ['#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

const Reports: React.FC = () => {
  const [activeDateRange, setActiveDateRange] = useState<DateRange>('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = revenueData.reduce((sum, d) => sum + d.bookings, 0);
  const avgBookingValue = totalRevenue / totalBookings;
  const occupancyRate = 72; // Mock value

  // Top performing rooms
  const topRooms = mockRooms
    .map((room) => {
      const roomBookings = mockBookings.filter((b) => b.roomId === room.id);
      const revenue = roomBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      return {
        ...room,
        bookings: roomBookings.length,
        revenue,
        occupancy: Math.floor(Math.random() * 40) + 60,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Comprehensive insights into hotel performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex flex-wrap gap-2">
        {dateRangeOptions.map((option) => (
          <Button
            key={option.value}
            variant={activeDateRange === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveDateRange(option.value)}
            className={cn(
              'transition-all',
              activeDateRange === option.value && 'shadow-md'
            )}
          >
            {option.label}
          </Button>
        ))}
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Custom Range
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% vs last period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{totalBookings}</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.3% vs last period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(avgBookingValue)}</p>
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" />
                  -2.1% vs last period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold mt-1">{occupancyRate}%</p>
                <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.7% vs last period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Percent className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockBookingSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {mockBookingSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy by Room Type */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy by Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="type"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="occupied" name="Occupied" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="available" name="Available" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Stay Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Average Stay Duration (Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} days`, 'Avg. Stay']}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDays"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Occupancy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                    <TableCell className="capitalize">{room.type}</TableCell>
                    <TableCell>{room.bookings}</TableCell>
                    <TableCell className="text-primary font-medium">
                      {formatCurrency(room.revenue)}
                    </TableCell>
                    <TableCell>{room.occupancy}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBookingSources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell>{source.count}</TableCell>
                    <TableCell className="text-primary font-medium">
                      {formatCurrency(source.count * 25000)}
                    </TableCell>
                    <TableCell>{source.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
