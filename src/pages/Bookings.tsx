import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingFilters from '@/components/bookings/BookingFilters';
import BookingsTable from '@/components/bookings/BookingsTable';
import { mockBookings, mockGuests, mockRooms } from '@/data/mockData';
import { BookingStatus } from '@/types/hotel';

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredBookings = useMemo(() => {
    return mockBookings.filter((booking) => {
      // Status filter
      if (activeFilter !== 'all' && booking.status !== activeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const guest = mockGuests.find((g) => g.id === booking.guestId);
        const room = mockRooms.find((r) => r.id === booking.roomId);
        const searchLower = searchQuery.toLowerCase();

        const matchesBookingId = booking.bookingId.toLowerCase().includes(searchLower);
        const matchesGuest =
          guest &&
          `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchLower);
        const matchesRoom =
          room && room.roomNumber.toLowerCase().includes(searchLower);

        if (!matchesBookingId && !matchesGuest && !matchesRoom) {
          return false;
        }
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  const handleView = (id: string) => {
    navigate(`/bookings/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/bookings/${id}/edit`);
  };

  const handleNewBooking = () => {
    navigate('/bookings/new');
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <BookingFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewBooking={handleNewBooking}
      />

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
          <span className="text-sm font-medium">
            {selectedIds.length} booking{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive">
            <X className="h-4 w-4" />
            Cancel Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearSelection}>
            Clear Selection
          </Button>
        </div>
      )}

      <BookingsTable
        bookings={filteredBookings}
        guests={mockGuests}
        rooms={mockRooms}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredBookings.length} of {mockBookings.length} bookings
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
