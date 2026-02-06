import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, IndianRupee, UserCheck, DoorOpen } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import BookingSourcesChart from '@/components/dashboard/BookingSourcesChart';
import RecentActivityTable from '@/components/dashboard/RecentActivityTable';
import QuickActions from '@/components/dashboard/QuickActions';
import {
  mockDashboardStats,
  mockRevenueData,
  mockBookingSources,
  mockRecentActivity,
} from '@/data/mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [revenuePeriod, setRevenuePeriod] = useState<'7' | '30' | '90'>('30');

  const getFilteredRevenueData = () => {
    const days = parseInt(revenuePeriod);
    return mockRevenueData.slice(-days);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Bookings Today"
          value={mockDashboardStats.totalBookingsToday}
          change={mockDashboardStats.bookingsChange}
          changeLabel="vs yesterday"
          icon={CalendarCheck}
          trend="up"
        />
        <StatCard
          title="Revenue Today"
          value={formatCurrency(mockDashboardStats.revenueToday)}
          change={mockDashboardStats.revenueChange}
          changeLabel="vs yesterday"
          icon={IndianRupee}
          trend="up"
        />
        <StatCard
          title="Check-ins Today"
          value={mockDashboardStats.checkInsToday}
          icon={UserCheck}
        >
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Check-outs</span>
              <span className="font-medium text-foreground">{mockDashboardStats.checkOutsToday}</span>
            </div>
          </div>
        </StatCard>
        <StatCard
          title="Available Rooms"
          value={`${mockDashboardStats.availableRooms}/${mockDashboardStats.totalRooms}`}
          icon={DoorOpen}
        >
          <div className="space-y-1 text-xs">
            {mockDashboardStats.roomTypeBreakdown.slice(0, 3).map((room) => (
              <div key={room.type} className="flex justify-between text-muted-foreground">
                <span className="capitalize">{room.type}</span>
                <span>{room.available}/{room.total}</span>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart
            data={getFilteredRevenueData()}
            selectedPeriod={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
          />
        </div>
        <div className="lg:col-span-2">
          <BookingSourcesChart data={mockBookingSources} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivityTable
        activities={mockRecentActivity}
        onViewAll={() => navigate('/bookings')}
      />

      {/* Quick Actions FAB */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;
