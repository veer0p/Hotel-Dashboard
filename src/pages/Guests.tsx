import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Download, Plus, Crown, Ban, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockGuests, mockBookings } from '@/data/mockData';
import { Guest } from '@/types/hotel';
import { cn } from '@/lib/utils';

type GuestFilter = 'all' | 'vip' | 'frequent' | 'blacklist';

const filterOptions: { value: GuestFilter; label: string }[] = [
  { value: 'all', label: 'All Guests' },
  { value: 'vip', label: 'VIP' },
  { value: 'frequent', label: 'Frequent' },
  { value: 'blacklist', label: 'Blacklist' },
];

const Guests: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GuestFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = useMemo(() => {
    return mockGuests.filter((guest) => {
      if (activeFilter === 'vip' && !guest.isVIP) return false;
      if (activeFilter === 'frequent' && guest.totalBookings < 5) return false;
      if (activeFilter === 'blacklist' && !guest.isBlacklisted) return false;

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchLower);
        const matchesEmail = guest.email.toLowerCase().includes(searchLower);
        const matchesPhone = guest.phone.includes(searchQuery);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [activeFilter, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const guestBookings = selectedGuest
    ? mockBookings.filter((b) => b.guestId === selectedGuest.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Guest Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage guest profiles and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(option.value)}
              className={cn(
                'transition-all',
                activeFilter === option.value && 'shadow-md'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Guest</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest) => (
              <TableRow key={guest.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {guest.firstName[0]}{guest.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{guest.email}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>{guest.totalBookings}</TableCell>
                <TableCell className="font-medium text-primary">
                  {formatCurrency(guest.totalSpent)}
                </TableCell>
                <TableCell>
                  {guest.lastVisit
                    ? format(new Date(guest.lastVisit), 'MMM dd, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {guest.isVIP && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                        <Crown className="h-3 w-3" />
                        VIP
                      </Badge>
                    )}
                    {guest.isBlacklisted && (
                      <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
                        <Ban className="h-3 w-3" />
                        Blacklist
                      </Badge>
                    )}
                    {!guest.isVIP && !guest.isBlacklisted && (
                      <Badge variant="outline">Regular</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedGuest(guest)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Guest
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredGuests.length} of {mockGuests.length} guests
      </p>

      {/* Guest Profile Modal */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {selectedGuest?.firstName[0]}{selectedGuest?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p>{selectedGuest?.firstName} {selectedGuest?.lastName}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {selectedGuest?.email}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">Booking History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedGuest?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Type</p>
                  <p className="font-medium capitalize">{selectedGuest?.idType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID Number</p>
                  <p className="font-medium">{selectedGuest?.idNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {selectedGuest?.createdAt
                      ? format(new Date(selectedGuest.createdAt), 'MMM dd, yyyy')
                      : '-'}
                  </p>
                </div>
              </div>
              {selectedGuest?.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedGuest.address}</p>
                </div>
              )}
              {selectedGuest?.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedGuest.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {selectedGuest?.totalBookings}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedGuest?.totalSpent || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency((selectedGuest?.totalSpent || 0) / (selectedGuest?.totalBookings || 1))}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Value</p>
                  </div>
                </div>
                <div className="max-h-60 overflow-auto">
                  {guestBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">#{booking.bookingId}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <p className="font-medium text-primary">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Guest preferences from past bookings and special requests.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Preferred Room Type</p>
                    <p className="font-medium capitalize">
                      {selectedGuest?.preferences?.roomType || 'No preference'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Preferred Floor</p>
                    <p className="font-medium capitalize">
                      {selectedGuest?.preferences?.floor || 'No preference'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Preferred Bed Type</p>
                    <p className="font-medium capitalize">
                      {selectedGuest?.preferences?.bedType || 'No preference'}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Preferred View</p>
                    <p className="font-medium capitalize">
                      {selectedGuest?.preferences?.view || 'No preference'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guests;
