import React from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Eye, Edit, LogIn, LogOut, X, Mail, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import BookingStatusBadge from './BookingStatusBadge';
import { Booking, Guest, Room } from '@/types/hotel';

interface BookingsTableProps {
  bookings: Booking[];
  guests: Guest[];
  rooms: Room[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  guests,
  rooms,
  selectedIds,
  onSelectChange,
  onView,
  onEdit,
}) => {
  const getGuest = (guestId: string) => guests.find((g) => g.id === guestId);
  const getRoom = (roomId: string) => rooms.find((r) => r.id === roomId);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(bookings.map((b) => b.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((i) => i !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === bookings.length && bookings.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Guest</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const guest = getGuest(booking.guestId);
            const room = getRoom(booking.roomId);
            const initials = guest
              ? `${guest.firstName[0]}${guest.lastName[0]}`
              : 'NA';

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(booking.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(booking.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium text-primary">
                  #{booking.bookingId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{room?.roomNumber}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {room?.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(booking.checkIn), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {booking.adults}A
                  {booking.children > 0 && `, ${booking.children}C`}
                  {booking.infants > 0 && `, ${booking.infants}I`}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(booking.totalAmount)}
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(booking.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(booking.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Booking
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {booking.status === 'confirmed' && (
                        <DropdownMenuItem>
                          <LogIn className="mr-2 h-4 w-4" />
                          Check In
                        </DropdownMenuItem>
                      )}
                      {booking.status === 'checked-in' && (
                        <DropdownMenuItem>
                          <LogOut className="mr-2 h-4 w-4" />
                          Check Out
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Receipt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
