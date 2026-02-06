import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Copy, Trash2, Eye, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockDecorationPackages, mockDecorationOrders, mockBookings, mockGuests, mockRooms } from '@/data/mockData';
import { DecorationPackage } from '@/types/hotel';
import { cn } from '@/lib/utils';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const Decorations: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedPackage, setSelectedPackage] = useState<DecorationPackage | null>(null);

  const filteredPackages = mockDecorationPackages.filter((pkg) => {
    if (activeFilter === 'active') return pkg.isActive;
    if (activeFilter === 'inactive') return !pkg.isActive;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOrderDetails = (order: typeof mockDecorationOrders[0]) => {
    const booking = mockBookings.find((b) => b.id === order.bookingId);
    const guest = booking ? mockGuests.find((g) => g.id === booking.guestId) : null;
    const room = mockRooms.find((r) => r.id === order.roomId);
    const pkg = mockDecorationPackages.find((p) => p.id === order.packageId);
    return { booking, guest, room, pkg };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Decoration Packages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage decoration packages for special occasions
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Package
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(option.value as typeof activeFilter)}
            className={cn(
              'transition-all',
              activeFilter === option.value && 'shadow-md'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative h-48 bg-muted overflow-hidden">
              <img
                src={pkg.images[0] || '/placeholder.svg'}
                alt={pkg.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge
                  className={cn(
                    pkg.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{pkg.name}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {pkg.occasionType}
                  </Badge>
                </div>
                <Switch checked={pkg.isActive} />
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {pkg.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{pkg.inclusions.length} items included</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(pkg.price)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDecorationOrders.map((order) => {
                const { booking, guest, room, pkg } = getOrderDetails(order);
                return (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-primary">
                      #{booking?.bookingId}
                    </TableCell>
                    <TableCell>
                      {guest ? `${guest.firstName} ${guest.lastName}` : '-'}
                    </TableCell>
                    <TableCell>{pkg?.name}</TableCell>
                    <TableCell>{room?.roomNumber}</TableCell>
                    <TableCell>
                      {format(new Date(order.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          order.status === 'delivered' &&
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                          order.status === 'setup-complete' &&
                            'bg-blue-500/20 text-blue-400 border-blue-500/30',
                          order.status === 'pending' &&
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        )}
                      >
                        {order.status === 'setup-complete'
                          ? 'Setup Complete'
                          : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Package Details Modal */}
      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPackage?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="h-48 rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedPackage?.images[0] || '/placeholder.svg'}
                alt={selectedPackage?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {selectedPackage?.occasionType}
              </Badge>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(selectedPackage?.price || 0)}
              </span>
            </div>
            <p className="text-muted-foreground">{selectedPackage?.description}</p>
            <div>
              <p className="font-medium mb-2">Inclusions:</p>
              <ul className="space-y-1">
                {selectedPackage?.inclusions.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Setup Time: {selectedPackage?.setupTime} hours</span>
              <span>•</span>
              <span>{selectedPackage?.showOnWebsite ? 'Shown on website' : 'Hidden from website'}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Decorations;
