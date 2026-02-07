import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import EditBooking from "./pages/EditBooking";
import NewBooking from "./pages/NewBooking";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import EditRoom from "./pages/EditRoom";
import Guests from "./pages/Guests";
import Decorations from "./pages/Decorations";
import CalendarView from "./pages/CalendarView";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/new" element={<NewBooking />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/bookings/:id/edit" element={<EditBooking />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms/:id/edit" element={<EditRoom />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/decorations" element={<Decorations />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/help" element={<HelpSupport />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
