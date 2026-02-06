import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid3X3, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoomCard from '@/components/rooms/RoomCard';
import RoomStatusBadge from '@/components/rooms/RoomStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockRooms } from '@/data/mockData';
import { RoomStatus } from '@/types/hotel';
import { cn } from '@/lib/utils';

const filterOptions: { value: RoomStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Rooms' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
];

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<RoomStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = useMemo(() => {
    return mockRooms.filter((room) => {
      if (activeFilter !== 'all' && room.status !== activeFilter) {
        return false;
      }
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = room.name.toLowerCase().includes(searchLower);
        const matchesNumber = room.roomNumber.toLowerCase().includes(searchLower);
        const matchesType = room.type.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesNumber && !matchesType) {
          return false;
        }
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

  const handleView = (id: string) => {
    navigate(`/rooms/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/rooms/${id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rooms Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all hotel rooms and their status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Room
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
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Room No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bed</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell className="capitalize">{room.type}</TableCell>
                  <TableCell>
                    <RoomStatusBadge status={room.status} />
                  </TableCell>
                  <TableCell className="capitalize">{room.bedType}</TableCell>
                  <TableCell>{room.maxGuests}</TableCell>
                  <TableCell className="font-medium text-primary">
                    {formatCurrency(room.basePrice)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(room.id)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Showing {filteredRooms.length} of {mockRooms.length} rooms
      </p>
    </div>
  );
};

export default Rooms;
