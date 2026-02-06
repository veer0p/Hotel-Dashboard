import React from 'react';
import { Search, Calendar, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookingStatus } from '@/types/hotel';
import { cn } from '@/lib/utils';

interface BookingFiltersProps {
  activeFilter: BookingStatus | 'all';
  onFilterChange: (filter: BookingStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewBooking: () => void;
}

const filterOptions: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked-in', label: 'Checked-In' },
  { value: 'checked-out', label: 'Checked-Out' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

const BookingFilters: React.FC<BookingFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onNewBooking,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Bookings Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all hotel bookings and reservations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={onNewBooking} className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(option.value)}
              className={cn(
                'transition-all',
                activeFilter === option.value && 'shadow-md'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by guest name, booking ID, or room..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
