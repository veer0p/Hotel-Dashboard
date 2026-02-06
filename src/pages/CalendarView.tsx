import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, LogIn, LogOut, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBookings, mockGuests, mockRooms } from '@/data/mockData';
import { Booking } from '@/types/hotel';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-emerald-500',
  pending: 'bg-amber-500',
  'checked-in': 'bg-blue-500',
  'checked-out': 'bg-muted-foreground',
  cancelled: 'bg-destructive',
};

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);

  const events: CalendarEvent[] = useMemo(() => {
    return mockBookings
      .filter((booking) => booking.status !== 'cancelled')
      .map((booking) => {
        const guest = mockGuests.find((g) => g.id === booking.guestId);
        const room = mockRooms.find((r) => r.id === booking.roomId);
        return {
          id: booking.id,
          title: `${room?.roomNumber} - ${guest?.firstName} ${guest?.lastName}`,
          start: new Date(booking.checkIn),
          end: new Date(booking.checkOut),
          resource: booking,
        };
      });
  }, []);

  const todayBookings = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return {
      checkIns: mockBookings.filter(
        (b) => b.checkIn === today && (b.status === 'confirmed' || b.status === 'pending')
      ),
      checkOuts: mockBookings.filter(
        (b) => b.checkOut === today && b.status === 'checked-in'
      ),
    };
  }, []);

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return mockBookings
      .filter((b) => {
        const checkIn = new Date(b.checkIn);
        return checkIn > today && checkIn <= nextWeek && b.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
      .slice(0, 5);
  }, []);

  const getGuestName = (guestId: string) => {
    const guest = mockGuests.find((g) => g.id === guestId);
    return guest ? `${guest.firstName} ${guest.lastName}` : 'Unknown';
  };

  const getRoomNumber = (roomId: string) => {
    const room = mockRooms.find((r) => r.id === roomId);
    return room?.roomNumber || '-';
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const statusColor = statusColors[event.resource.status] || 'bg-primary';
    return {
      className: `${statusColor} text-white rounded px-2 py-0.5 text-xs font-medium border-0`,
    };
  };

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else {
      const newDate = new Date(currentDate);
      if (currentView === Views.MONTH) {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      } else if (currentView === Views.WEEK) {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      } else {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      }
      setCurrentDate(newDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Calendar View</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visual overview of all bookings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleNavigate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleNavigate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate('today')}
                  >
                    Today
                  </Button>
                  <h2 className="text-lg font-semibold ml-2">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                </div>
                <div className="flex gap-1">
                  {[
                    { view: Views.MONTH, label: 'Month' },
                    { view: Views.WEEK, label: 'Week' },
                    { view: Views.DAY, label: 'Day' },
                  ].map(({ view, label }) => (
                    <Button
                      key={view}
                      variant={currentView === view ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentView(view)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] calendar-wrapper">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  view={currentView}
                  onView={setCurrentView}
                  eventPropGetter={eventStyleGetter}
                  toolbar={false}
                  popup
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Check-ins */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <LogIn className="h-4 w-4 text-emerald-400" />
                Today's Check-ins
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayBookings.checkIns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No check-ins today</p>
              ) : (
                <div className="space-y-2">
                  {todayBookings.checkIns.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {getGuestName(booking.guestId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {getRoomNumber(booking.roomId)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {booking.adults}A{booking.children > 0 && `, ${booking.children}C`}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Check-outs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <LogOut className="h-4 w-4 text-amber-400" />
                Today's Check-outs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayBookings.checkOuts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No check-outs today</p>
              ) : (
                <div className="space-y-2">
                  {todayBookings.checkOuts.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {getGuestName(booking.guestId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Room {getRoomNumber(booking.roomId)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-400" />
                Upcoming (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming bookings</p>
              ) : (
                <div className="space-y-2">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {getGuestName(booking.guestId)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(booking.checkIn), 'MMM dd')} • Room {getRoomNumber(booking.roomId)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="text-sm text-muted-foreground capitalize">{status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>

      <style>{`
        .calendar-wrapper .rbc-calendar {
          background: transparent;
        }
        .calendar-wrapper .rbc-header {
          background: hsl(var(--muted));
          padding: 8px;
          font-weight: 600;
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-month-view,
        .calendar-wrapper .rbc-time-view {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-day-bg {
          background: hsl(var(--background));
        }
        .calendar-wrapper .rbc-off-range-bg {
          background: hsl(var(--muted) / 0.5);
        }
        .calendar-wrapper .rbc-today {
          background: hsl(var(--primary) / 0.1);
        }
        .calendar-wrapper .rbc-date-cell {
          padding: 4px 8px;
          color: hsl(var(--foreground));
        }
        .calendar-wrapper .rbc-off-range {
          color: hsl(var(--muted-foreground));
        }
        .calendar-wrapper .rbc-month-row,
        .calendar-wrapper .rbc-day-bg + .rbc-day-bg {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-time-content {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-timeslot-group {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-time-header-content {
          border-color: hsl(var(--border));
        }
        .calendar-wrapper .rbc-time-slot {
          color: hsl(var(--muted-foreground));
        }
        .calendar-wrapper .rbc-event {
          border: none !important;
        }
        .calendar-wrapper .rbc-show-more {
          color: hsl(var(--primary));
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
