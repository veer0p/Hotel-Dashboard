import React from 'react';
import { Users, Maximize, Bed, Eye, Edit, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RoomStatusBadge from './RoomStatusBadge';
import { Room } from '@/types/hotel';

interface RoomCardProps {
  room: Room;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const amenityIcons: Record<string, string> = {
  wifi: '📶',
  tv: '📺',
  ac: '❄️',
  minibar: '🍾',
  safe: '🔐',
  balcony: '🏞️',
  jacuzzi: '🛁',
  'sea-view': '🌊',
  'private-pool': '🏊',
  workspace: '💼',
};

const RoomCard: React.FC<RoomCardProps> = ({ room, onView, onEdit }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={room.images[0] || '/placeholder.svg'}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <RoomStatusBadge status={room.status} />
        </div>
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 font-semibold text-sm">
          {room.roomNumber}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{room.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{room.type}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(room.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(room.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            <span className="capitalize">{room.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{room.maxGuests}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4" />
            <span>{room.size}m²</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {room.amenities.slice(0, 5).map((amenity) => (
            <span
              key={amenity}
              className="text-sm bg-muted px-2 py-0.5 rounded"
              title={amenity}
            >
              {amenityIcons[amenity] || '✓'}
            </span>
          ))}
          {room.amenities.length > 5 && (
            <span className="text-sm text-muted-foreground">
              +{room.amenities.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(room.basePrice)}
            </span>
            <span className="text-sm text-muted-foreground"> /night</span>
          </div>
          <Button size="sm" onClick={() => onView(room.id)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
