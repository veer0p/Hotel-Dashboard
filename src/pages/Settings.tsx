import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockStaff } from '@/data/mockData';
import { StaffRole } from '@/types/hotel';

const roleColors: Record<StaffRole, string> = {
  admin: 'bg-destructive/20 text-destructive border-destructive/30',
  manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'front-desk': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  housekeeping: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const Settings: React.FC = () => {
  const [hotelName, setHotelName] = useState('Grand Palace Hotel');
  const [hotelEmail, setHotelEmail] = useState('info@grandpalace.com');
  const [hotelPhone, setHotelPhone] = useState('+91 98765 43210');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [taxRate, setTaxRate] = useState('18');
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage hotel configuration and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList className="grid w-full max-w-xl grid-cols-4">
          <TabsTrigger value="hotel">Hotel Info</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Hotel Info Tab */}
        <TabsContent value="hotel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>
                Basic information about your hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 200x200px, PNG or SVG
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input
                    id="hotelName"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelEmail">Email</Label>
                  <Input
                    id="hotelEmail"
                    type="email"
                    value={hotelEmail}
                    onChange={(e) => setHotelEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelPhone">Phone</Label>
                  <Input
                    id="hotelPhone"
                    value={hotelPhone}
                    onChange={(e) => setHotelPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue="123 Beach Road, Goa, India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in Time</Label>
                  <Select value={checkInTime} onValueChange={setCheckInTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-out Time</Label>
                  <Select value={checkOutTime} onValueChange={setCheckOutTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {staff.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={roleColors[staff.role]}
                        >
                          {staff.role.charAt(0).toUpperCase() + staff.role.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            staff.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-muted text-muted-foreground'
                          }
                        >
                          {staff.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure what each role can access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['admin', 'manager', 'front-desk', 'housekeeping'] as StaffRole[]).map(
                  (role) => (
                    <div key={role} className="p-4 rounded-lg border border-border">
                      <h4 className="font-medium capitalize mb-3">
                        {role.replace('-', ' ')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        {role === 'admin' && (
                          <>
                            <p className="text-muted-foreground">• Full system access</p>
                            <p className="text-muted-foreground">• Manage users</p>
                            <p className="text-muted-foreground">• View reports</p>
                            <p className="text-muted-foreground">• Configure settings</p>
                          </>
                        )}
                        {role === 'manager' && (
                          <>
                            <p className="text-muted-foreground">• Manage bookings</p>
                            <p className="text-muted-foreground">• Manage rooms</p>
                            <p className="text-muted-foreground">• View reports</p>
                            <p className="text-muted-foreground">• Manage guests</p>
                          </>
                        )}
                        {role === 'front-desk' && (
                          <>
                            <p className="text-muted-foreground">• Create bookings</p>
                            <p className="text-muted-foreground">• Check-in/out</p>
                            <p className="text-muted-foreground">• View rooms</p>
                            <p className="text-muted-foreground">• View guests</p>
                          </>
                        )}
                        {role === 'housekeeping' && (
                          <>
                            <p className="text-muted-foreground">• Update room status</p>
                            <p className="text-muted-foreground">• View assignments</p>
                          </>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how information is displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select defaultValue="12h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'newBooking', label: 'New booking notifications', enabled: true },
                { id: 'checkIn', label: 'Check-in reminders', enabled: true },
                { id: 'checkOut', label: 'Check-out reminders', enabled: true },
                { id: 'payment', label: 'Payment notifications', enabled: true },
                { id: 'maintenance', label: 'Maintenance alerts', enabled: false },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email and in-app
                    </p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Razorpay',
                description: 'Accept payments via cards, UPI, and net banking',
                connected: true,
                icon: '💳',
              },
              {
                name: 'Stripe',
                description: 'International payment processing',
                connected: false,
                icon: '💰',
              },
              {
                name: 'SendGrid',
                description: 'Email notifications and confirmations',
                connected: true,
                icon: '📧',
              },
              {
                name: 'Twilio',
                description: 'SMS notifications to guests',
                connected: false,
                icon: '📱',
              },
              {
                name: 'Google Calendar',
                description: 'Sync bookings with Google Calendar',
                connected: false,
                icon: '📅',
              },
              {
                name: 'Booking.com',
                description: 'OTA channel manager integration',
                connected: false,
                icon: '🏨',
              },
            ].map((integration) => (
              <Card key={integration.name}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        integration.connected
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : ''
                      }
                    >
                      {integration.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">Connect</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
