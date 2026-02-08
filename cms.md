# Quick Note

# 🏨 Hotel Management SaaS - Complete UI Implementation Guide

## **🎯 OVERVIEW & CONTEXT FOR AI AGENTS**

**Project:** Modern Hotel PMS SaaS Platform

**Core Problem:** Traditional hotel PMS systems are slow, cluttered, complex, and require extensive training. Staff struggle with multiple windows, nested menus, and data re-entry.

**Our Solution:** A revolutionary hotel management system that's:

1. **Visual-first** - Replace spreadsheets with interactive floor plans and timelines
2. **Action-oriented** - Every screen has primary actions visible
3. **Real-time** - Live updates without page reloads
4. **Intuitive** - Max 2 clicks to any common action
5. **Mobile-responsive** - Works flawlessly on tablets and phones

**Technical Stack:** React 18+, Material-UI (MUI) v5, Tailwind CSS, React Query, React DnD Kit

**Design System:** See previous color palette and typography specifications

---

## **📊 PAGE 1: DASHBOARD - "Hotel Pulse"**

### **📋 FEATURES LIST**

1. **Today's Pulse Metrics** - 4 key metrics: Occupancy %, Today's Revenue, Arrivals Count, Checkouts Count
2. **Living Floor Plan** - Mini visual room grid with real-time status colors
3. **Today's Schedule** - Timeline of arrivals/departures with action buttons
4. **Shift-Aware Display** - Different data priorities for morning/evening/night shifts
5. **Real-time Updates** - Live WebSocket updates for all metrics
6. **Global Command Palette** - Cmd+K search for quick navigation
7. **Quick Action Bar** - Contextual actions based on current shift/time
8. **Room Status Legend** - Color coding explanation (vacant/occupied/dirty/maintenance)
9. **Performance Trends** - Mini trend indicators (up/down arrows with percentages)
10. **Notifications Panel** - Alert system for VIP arrivals, maintenance issues, etc.

### **🎨 WIREFRAME LAYOUT**

```
┌─────────────────────────────────────────────────────┐
│ [Logo] PMS Pro • Main Hotel • 2:45 PM • 👤 John     │
├─────────────────────────────────────────────────────┤
│ [Search: Cmd+K] [Notifications 3]                   │
├─────┬───────────────────────────────────────────────┤
│     │                                               │
│ 🏠  │              TODAY'S PULSE                     │
│ 📅  │  ┌─────────┐┌─────────┐┌─────────┐┌─────────┐ │
│ 🛏️  │  │   85%   ││ $5,240  ││   12    ││   8     │ │
│ 👥  │  │Occupancy││ Revenue ││Arrivals ││Checkouts│ │
│ 💰  │  │  ↑2%    ││  ↓5%    ││  →      ││  →      │ │
│ ⚙️  │  └─────────┘└─────────┘└─────────┘└─────────┘ │
│     │                                               │
│ [+] │               LIVING FLOOR PLAN               │
│     │  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐   │
│     │  │101││102││103││104││105││106││107││108│   │
│     │  │🟢 ││🟣 ││🟢 ││🟡 ││🟢 ││🔴 ││🟣 ││🟡 │   │
│     │  │   ││S.C││   ││   ││   ││   ││A.P││   │   │
│     │  └───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘   │
│     │  Legend: 🟢 Vacant 🟣 Occupied 🟡 Dirty 🔴 Maint│
│     │                                               │
│     │              TODAY'S SCHEDULE                 │
│     │  ┌──────┬─────────────┬────────┬──────────┐  │
│     │  │ Time │ Guest       │ Room   │ Action   │  │
│     │  ├──────┼─────────────┼────────┼──────────┤  │
│     │  │ 3:00 │ Sarah Chen  │ 102    │[Check-in]│  │
│     │  │ 3:30 │ Alex Patel  │ 201    │[Maint]   │  │
│     │  │ 4:00 │ Group (4)   │103-104 │[Prepare] │  │
│     │  └──────┴─────────────┴────────┴──────────┘  │
│     │                                               │
│     │  [Quick Check-in] [New Booking] [View All]   │
└─────┴───────────────────────────────────────────────┘
```

### **🎯 STAGE-WISE IMPLEMENTATION PROMPTS FOR AI AGENTS**

### **STAGE 1: SETUP BASIC DASHBOARD LAYOUT**

```
CONTEXT: Create the Dashboard.jsx component as the landing page for hotel staff. This page must load instantly and show the most critical information at a glance.

TECH REQUIREMENTS:
- Use React 18 functional component with TypeScript
- Implement Material-UI Grid system with responsive breakpoints
- Use Tailwind CSS for custom styling
- Create a loading skeleton for initial load

EXACT IMPLEMENTATION STEPS:

1. Create Dashboard component structure:
   - Create `src/pages/Dashboard/Dashboard.tsx`
   - Implement basic layout with MUI Container maxWidth="xl"
   - Add 3 main sections: Metrics (top), Floor Plan (middle), Schedule (bottom)

2. Build Metrics Section:
   - Create 4 MetricCard components in a 2x2 grid on desktop, 1x4 on mobile
   - Each card: White background, subtle shadow, rounded corners (md)
   - Content: Large number (Inter, 32px, semibold), label (14px, gray-600), trend indicator
   - Use MUI Grid: xs={12} sm={6} md={3} for responsive layout

3. Build Floor Plan Mini Section:
   - Create horizontal scrollable container with flex overflow-x-auto
   - Create RoomMiniCard component (80px x 80px) for each room
   - Room card design: Square, colored border based on status, room number centered
   - Status colors: green-500 (vacant), purple-500 (occupied), amber-500 (dirty), red-500 (maintenance)

4. Build Schedule Table:
   - Use MUI Table with sticky header
   - Columns: Time, Guest, Room, Action
   - Action column contains MUI Button with primary color
   - Implement pagination for >10 rows

5. Add Loading State:
   - Create Skeleton components that match each section
   - Show skeletons for 500ms minimum before showing data

DESIGN SPECIFICS:
- Background color: gray-50 (bg-gray-50)
- Card background: white
- Border radius: 8px (rounded-lg)
- Shadows: card shadow-lg on hover
- Typography: Use Inter font via @font-face
- Spacing: 24px between sections, 16px within sections
```

### **STAGE 2: IMPLEMENT REAL-TIME UPDATES**

```
CONTEXT: Hotel operations require live updates. When a room status changes or new booking arrives, the dashboard should update instantly without manual refresh.

TECH REQUIREMENTS:
- Implement WebSocket connection using socket.io-client
- Use React Query for data fetching and caching
- Implement optimistic updates for immediate UI feedback
- Add visual indicators for changes

EXACT IMPLEMENTATION STEPS:

1. Set up WebSocket connection:
   - Create `src/services/socket.ts` with Socket.IO client
   - Connect to `ws://localhost:3001` (or env variable)
   - Implement reconnection logic with exponential backoff
   - Create SocketContext for global access

2. Implement room status subscription:
   - Subscribe to 'room-status-update' event
   - When update received, update specific room card in floor plan
   - Animate update: color pulse animation for 2 seconds
   - Update occupancy metric in real-time

3. Implement booking updates:
   - Subscribe to 'new-booking', 'checkin', 'checkout' events
   - Update Today's Schedule table without refresh
   - Update arrivals/checkouts metrics
   - Add toast notification for VIP arrivals

4. Create useDashboardMetrics hook:
   - Use React Query to fetch initial metrics
   - Set up refetch interval of 30 seconds
   - Implement optimistic updates when actions performed

5. Add visual change indicators:
   - When metric changes, show subtle up/down arrow with count
   - Animate number changes with React CountUp
   - Add pulsing dot on changing elements (CSS animation)

DESIGN SPECIFICS:
- Color pulse: Use keyframes for 0% to 100% opacity cycle
- Toast notifications: Position top-right, auto-dismiss in 5s
- Number animation: Smooth count over 500ms
- Offline indicator: Show warning banner when WebSocket disconnected
```

### **STAGE 3: ADD INTERACTIVE FEATURES**

```
CONTEXT: Hotel staff need to take action directly from the dashboard. Minimize clicks to common tasks.

TECH REQUIREMENTS:
- Implement drag-and-drop for room reassignment
- Add right-click context menus
- Create global command palette (Cmd+K)
- Add touch gestures for mobile

EXACT IMPLEMENTATION STEPS:

1. Implement room card interactions:
   - Click room: Open slide-over panel with room details
   - Right-click room: Show context menu (Mark Clean, Block Maintenance, View History)
   - Drag room: Implement drag handle (visible on hover) for future reassignment
   - Hover room: Show tooltip with guest name and stay details

2. Create Command Palette:
   - Use `cmdk` library for command palette
   - Trigger with Cmd+K (Ctrl+K on Windows)
   - Search categories: Guests, Rooms, Actions, Navigation
   - Implement fuzzy search across all hotel data

3. Add schedule table actions:
   - Click "Check-in" button: Open check-in modal pre-filled with guest data
   - Click guest name: Navigate to guest profile
   - Hover row: Highlight and show quick actions in right panel

4. Implement mobile touch gestures:
   - Swipe room card left: Quick check-in action
   - Swipe room card right: Mark clean action
   - Pull to refresh: Refresh all data
   - Tap and hold: Open context menu

5. Create contextual action footer:
   - Dynamic buttons based on current time/shift
   - Morning shift (6AM-2PM): [Check-in], [New Booking], [Housekeeping]
   - Evening shift (2PM-10PM): [Check-out], [Restaurant], [Messages]
   - Night audit (10PM-6AM): [Night Audit], [Reports], [Security]

DESIGN SPECIFICS:
- Slide-over panel: Fixed right position, 400px width, backdrop blur
- Context menu: White background, shadow-xl, rounded-md
- Command palette: Center modal, dark overlay, search input focused
- Touch feedback: Ripple effect on touch, haptic feedback on actions
- Button states: Hover scale-105, active scale-95 transitions
```

### **STAGE 4: MOBILE OPTIMIZATION & PERFORMANCE**

```
CONTEXT: Hotel staff use tablets and phones. The dashboard must be touch-friendly and performant on all devices.

TECH REQUIREMENTS:
- Implement responsive design down to 320px width
- Optimize images and assets for mobile
- Implement virtual scrolling for large lists
- Add offline capability for critical functions

EXACT IMPLEMENTATION STEPS:

1. Create mobile-responsive layout:
   - Breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
   - Mobile (<768px): Single column, stacked sections
   - Tablet (768px-1024px): 2-column layout for metrics
   - Desktop (>1024px): Full 3-section layout

2. Optimize floor plan for mobile:
   - Switch from grid to vertical list on mobile
   - Each room becomes a list item with status badge
   - Implement collapsible sections for each floor
   - Add filter chips: [Vacant], [Occupied], [Dirty], [All]

3. Implement virtual scrolling:
   - Use react-window for schedule table on mobile
   - Load only visible rows (20+ rows threshold)
   - Add infinite scroll for very large schedules

4. Add offline features:
   - Use localStorage for caching critical data
   - Implement queue for actions taken offline
   - Show connectivity status indicator
   - Sync pending actions when back online

5. Performance optimizations:
   - Lazy load non-critical components
   - Implement React.memo for room cards
   - Use useCallback for event handlers
   - Optimize re-renders with proper dependency arrays

DESIGN SPECIFICS:
- Touch targets: Minimum 44x44px for all interactive elements
- Font sizes: Base 16px, scale up for headings on mobile
- Spacing: Use rem units, tighter spacing on mobile
- Icons: SVG sprites, optimized for retina displays
- Loading: Skeleton screens match final layout exactly
```

---

## **📅 PAGE 2: CALENDAR/RESERVATIONS - "Time Block Theater"**

### **📋 FEATURES LIST**

1. **Dual View System** - Timeline (when) and Resource (which rooms) synchronized
2. **Visual Time Blocks** - Color-coded reservations with guest names
3. **Drag & Drop Editing** - Move, extend, reassign reservations visually
4. **Smart Creation** - Click+drag on empty space creates booking
5. **Group Management** - Visual linking of multi-room reservations
6. **Conflict Detection** - Visual warnings for overlaps
7. **Rate Display** - Show rate plan and price on each reservation
8. **Quick Filters** - Filter by room type, rate plan, guest type
9. **Zoom Controls** - Day/week/month/year views
10. **Bulk Operations** - Select multiple reservations for batch actions

### **🎨 WIREFRAME LAYOUT**

```
┌─────────────────────────────────────────────────────┐
│ 📅 Calendar • Main Hotel • Week Dec 15-21           │
├─────────────────────────────────────────────────────┤
│ [Day][Week][Month][Resources] [Filter: All ▼]       │
├─────┬───────────────────────────────────────────────┤
│     │                                               │
│LEFT │           TIME VIEW (Vertical)                │
│PANEL│  Mon 15                                       │
│     │  ██████████ Sarah Chen (101)          [Edit] │
│     │  ███ Alex Patel (102)                 [Edit] │
│     │  ████████████ Group Wedding (103-105)[Edit] │
│     │                                               │
│     │  Tue 16                                       │
│     │  █████ Michael Torres (201)           [Edit] │
│     │  █████████████ Lisa Wang (202)        [Edit] │
│     │                                               │
│     │  (Drag to create new booking)                 │
│     │                                               │
├─────┤                                               │
│ROOM │           RESOURCE VIEW (Gantt)               │
│LIST │  Rooms ↓  Mon15      Tue16      Wed17         │
│     │  ┌─────────────────────────────────────────┐  │
│     │  │101 ██████████ GuestA       ███ Maint    │  │
│     │  │    [12/15-18]             [12/18]       │  │
│     │  │                                         │  │
│     │  │102 ███ GuestB  ████████████             │  │
│     │  │    [12/15-16]  [12/17-20]               │  │
│     │  │                                         │  │
│     │  │103 ████████████ Group ███               │  │
│     │  │    [12/15-17]        [12/19-21]         │  │
│     │  └─────────────────────────────────────────┘  │
│     │                                               │
│     │  [Drag between rooms] [Drag to extend]        │
│     │                                               │
│     │          DETAIL PANEL (Slide-over)            │
│     │  ┌─────────────────────────────────────────┐  │
│     │  │ Sarah Chen • #RES-4821                  │  │
│     │  │ Room: 101 • 3 nights • $1,200           │  │
│     │  │ Status: Confirmed • Arr: 3:00 PM        │  │
│     │  │                                         │  │
│     │  │ [Check-in Early][Message][Modify]       │  │
│     │  │ [Cancel][Duplicate]                     │  │
│     │  └─────────────────────────────────────────┘  │
└─────┴───────────────────────────────────────────────┘
```

### **🎯 STAGE-WISE IMPLEMENTATION PROMPTS FOR AI AGENTS**

### **STAGE 1: BUILD CALENDAR FOUNDATION**

```
CONTEXT: Create the Calendar page that shows reservations in both time-based and resource-based views. Must handle hundreds of reservations efficiently.

TECH REQUIREMENTS:
- Use react-big-calendar or FullCalendar for timeline view
- Implement custom Gantt chart for resource view
- Use CSS Grid for layout, flexbox for alignment
- Implement virtualization for performance

EXACT IMPLEMENTATION STEPS:

1. Set up calendar container:
   - Create `src/pages/Calendar/Calendar.tsx`
   - Implement split view: Left 40% (time), Right 60% (resources) on desktop
   - Mobile: Stack vertically, time view first
   - Add view toggle buttons: Day, Week, Month, Resources

2. Build timeline view (left panel):
   - Use react-big-calendar with custom event component
   - Each event shows: Guest name, room number, duration bar
   - Color code by status: Confirmed (blue), Checked-in (purple), Tentative (gray)
   - Add "New Booking" drop zone at bottom

3. Build resource view (right panel):
   - Create custom Gantt chart using CSS Grid
   - Rows: Each room (sorted by floor/room number)
   - Columns: Time divisions (hours for day view, days for week view)
   - Each reservation: Position absolute with calculated left/width
   - Show connecting lines for multi-room reservations

4. Implement synchronization:
   - Click event in timeline → highlight in resource view
   - Click reservation in resource view → scroll to in timeline
   - Selection state shared between views

5. Add basic interactions:
   - Click event: Open details slide-over
   - Double-click event: Open edit modal
   - Right-click event: Context menu with actions

DESIGN SPECIFICS:
- Timeline view background: white, alternating row colors
- Resource view grid: Light gray lines, room rows 60px height
- Event blocks: Rounded corners, subtle shadow, text white for contrast
- Current time indicator: Red line across both views
- Loading: Show skeleton grid matching final layout
```

### **STAGE 2: IMPLEMENT DRAG & DROP EDITING**

```
CONTEXT: Hotel staff frequently need to move reservations, extend stays, or change rooms. This should be as simple as dragging blocks.

TECH REQUIREMENTS:
- Use @dnd-kit for drag and drop functionality
- Implement constraint validation (room availability, rate rules)
- Add visual feedback during drag operations
- Support touch drag on mobile devices

EXACT IMPLEMENTATION STEPS:

1. Set up drag context:
   - Wrap calendar in DndContext from @dnd-kit
   - Create draggable reservation components
   - Implement drop zones for rooms and time slots

2. Implement three drag modes:
   - Drag entire block: Move reservation to new dates/room
   - Drag left/right edge: Extend/shorten stay
   - Drag between views: Move from timeline to resource or vice versa

3. Add drag validation:
   - Check room availability before allowing drop
   - Validate rate plan rules (min/max stay)
   - Check for overlapping reservations
   - Validate user permissions (some staff can't modify certain reservations)

4. Create visual feedback:
   - Ghost image while dragging (semi-transparent copy)
   - Valid drop targets: Green highlight
   - Invalid drop targets: Red highlight with X icon
   - Drop preview: Show where reservation will land

5. Implement touch dragging:
   - Use @dnd-kit touch support
   - Add long-press to initiate drag on mobile
   - Implement swipe gestures for quick actions
   - Add haptic feedback on successful drop

DESIGN SPECIFICS:
- Drag handle: Visible only on hover, 6px wide, full height of block
- Ghost image: 50% opacity, dashed border
- Drop target highlight: Green border with glow effect
- Invalid target: Red border with "X" pattern
- Touch feedback: Ripple effect on press, vibration on actions
```

# **🎨 LAYOUT COMPONENTS - "Adaptive Command Center"**

## **📋 LAYOUT FEATURES LIST**

1. **Collapsible Navigation Rail** - Icon-only by default, expands on hover
2. **Global Command Palette** - Cmd+K search across entire system
3. **Contextual Action Footer** - Dynamic buttons based on current page/context
4. **Breadcrumb Navigation** - Minimal, only when needed (prefer tabs)
5. **Multi-Property Selector** - Switch between properties/departments
6. **Real-time Notification System** - Badges, toasts, and notification center
7. **User Menu & Settings** - Quick access to profile, settings, logout
8. **Shift Indicator** - Shows current shift (Morning/Evening/Night)
9. **Keyboard Shortcut Hints** - Shows available shortcuts for current page
10. **Theme Toggle** - Light/dark mode with auto-detection

### **🎨 MAIN LAYOUT WIREFRAME**

```
┌─────────────────────────────────────────────────────┐
│ TOP BAR (Fixed)                                     │
│ ┌─────┬────────────────────────┬─────────────────┐ │
│ │ Logo│ Search [Cmd+K]         │ ⏰ 👤 🔔(3) 🏨▼ │ │
│ └─────┴────────────────────────┴─────────────────┘ │
├─────────────────────────────────────────────────────┤
│                                                     │
│ LEFT RAIL (Collapsible)                             │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 🏠 Dashboard                                     │ │
│ │ 📅 Calendar                                      │ │
│ │ 🛏️ Rooms                                         │ │
│ │ 👥 Guests                                        │ │
│ │ 🎫 Check-in                                      │ │
│ │ 💰 Billing                                       │ │
│ │ ⚙️ Settings                                      │ │
│ │                                                 │ │
│ │ ───────                                         │ │
│ │ [+] Quick Add                                   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ MAIN CONTENT AREA (Dynamic)                         │
│ ┌─────────────────────────────────────────────────┐ │
│ │                                                 │ │
│ │              Page Content Here                  │ │
│ │                                                 │ │
│ │                                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ CONTEXT FOOTER (Appears when relevant)              │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Guest: Sarah Chen • Room 202 • $450 • 2 nights │ │
│ │ [Check-in] [Message] [Add Charge] [More]       │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### **📱 MOBILE LAYOUT WIREFRAME**

```
┌─────────────────────────────────────┐
│ TOP BAR (Mobile)                    │
│ ┌─────────┬──────────────────────┐ │
│ │ ☰ Menu  │ PMS Pro • Main Hotel │ │
│ └─────────┴──────────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│ PAGE CONTENT                        │
│                                     │
│ (Full screen, no side rail)         │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ BOTTOM NAVIGATION (Fixed)           │
│ ┌───┬───┬───┬───┬───┐              │
│ │🏠 │📅 │🛏️ │👥 │➕ │              │
│ │   │   │   │   │   │              │
│ └───┴───┴───┴───┴───┘              │
└─────────────────────────────────────┘
```

## **🎯 STAGE-WISE IMPLEMENTATION PROMPTS**

### **STAGE 1: CREATE BASIC LAYOUT STRUCTURE**

```
CONTEXT: Build the main layout component that wraps all pages. This layout must be consistent across the application and provide navigation, search, and user controls.

TECH REQUIREMENTS:
- Create a responsive layout with MUI Box and Container
- Implement CSS Grid for desktop, Flexbox for mobile
- Use React Router for navigation
- Create a layout context for managing global state

EXACT IMPLEMENTATION STEPS:

1. Create layout component structure:
   - Create `src/layouts/MainLayout.tsx`
   - Implement three main sections: TopBar, Sidebar, MainContent, ContextFooter
   - Use MUI Container with maxWidth="xl" for content area

2. Build TopBar component:
   - Fixed position, z-index: 1100 (above everything)
   - Left: Logo (text or image) with link to dashboard
   - Center: Search input with Cmd+K shortcut hint
   - Right: Time, user avatar, notifications bell, property selector
   - Background: white, shadow-sm, border-bottom

3. Build Sidebar (Navigation Rail):
   - Fixed left position, width: 72px collapsed, 240px expanded
   - Default state: Collapsed (icons only)
   - Hover state: Expands to show text labels
   - Mobile: Hidden, replaced by bottom navigation
   - Items: Dashboard, Calendar, Rooms, Guests, Check-in, Billing, Settings

4. Build MainContent area:
   - Flexible area that takes remaining space
   - Padding: 24px on desktop, 16px on mobile
   - Scrollable independently of sidebar and topbar
   - Background: gray-50 (light mode), gray-900 (dark mode)

5. Build ContextFooter component:
   - Fixed bottom, appears only when context exists
   - Shows selected guest/room/reservation details
   - Contains quick action buttons relevant to context
   - Auto-hides after 30 seconds of inactivity

DESIGN SPECIFICS:
- TopBar height: 64px
- Sidebar width: 72px collapsed, 240px expanded
- Transition duration: 200ms for all animations
- Shadow: topbar shadow-sm, sidebar shadow-right
- Border radius: none for topbar, rounded-r-lg for sidebar
- Icons: Heroicons outline, 24px, active state filled
```

### **STAGE 2: IMPLEMENT RESPONSIVE BEHAVIOR**

```
CONTEXT: The layout must work perfectly on desktop, tablet, and mobile. Different devices need different navigation patterns.

TECH REQUIREMENTS:
- Use MUI useMediaQuery hooks for breakpoints
- Implement mobile-first CSS approach
- Create separate navigation for mobile (bottom nav)
- Handle touch events and gestures

EXACT IMPLEMENTATION STEPS:

1. Define breakpoints:
   - xs: 0-640px (mobile)
   - sm: 641-768px (tablet portrait)
   - md: 769-1024px (tablet landscape)
   - lg: 1025-1280px (desktop)
   - xl: 1281px+ (large desktop)

2. Create mobile navigation:
   - Hide sidebar completely on mobile (< 768px)
   - Show hamburger menu in topbar that opens drawer
   - Implement bottom navigation bar with 5 main items
   - Bottom nav: Fixed position, z-index: 1000

3. Implement drawer for mobile:
   - MUI Drawer component (temporary variant)
   - Opens from left on hamburger click
   - Contains full navigation with all items
   - Backdrop with blur effect

4. Handle touch interactions:
   - Swipe from left edge to open drawer (mobile)
   - Swipe from right edge to open notifications (mobile)
   - Pull-to-refresh in main content area
   - Double-tap to scroll to top

5. Optimize for tablet:
   - Sidebar always collapsed (icon-only)
   - Larger touch targets (minimum 48px)
   - Split-view where appropriate (calendar on tablet)
   - Adjust font sizes for medium viewing distance

DESIGN SPECIFICS:
- Bottom nav height: 56px
- Drawer width: 280px
- Touch target size: 48x48px minimum
- Swipe threshold: 50px from edge
- Pull-to-refresh threshold: 80px pull
- Haptic feedback on mobile actions (if available)
```

### **STAGE 3: ADD GLOBAL FEATURES**

```
CONTEXT: Implement cross-cutting features that work across all pages: search, notifications, user menu, and theming.

TECH REQUIREMENTS:
- Implement global state management (React Context or Zustand)
- Create command palette using cmdk library
- Build notification system with real-time updates
- Implement theme switching with persistence

EXACT IMPLEMENTATION STEPS:

1. Create Command Palette (Cmd+K):
   - Use `cmdk` library for command menu
   - Trigger with Cmd+K (Ctrl+K on Windows)
   - Overlay: Dark backdrop with blur, centered modal
   - Search categories: Navigation, Actions, Guests, Rooms
   - Implement fuzzy search with highlighting

2. Build Notification System:
   - Bell icon in topbar with badge count
   - Click opens notification panel (slide-down)
   - Notification types: Alert (red), Info (blue), Success (green)
   - Real-time via WebSocket for live updates
   - Mark as read, clear all, action buttons in notifications

3. Implement User Menu:
   - Click avatar opens dropdown menu
   - Items: Profile, Settings, Switch Property, Logout
   - Show current user name and role
   - Quick access to recently accessed properties

4. Create Theme System:
   - Light/dark mode toggle in user menu
   - Auto-detect system preference
   - Persist preference in localStorage
   - Support for high-contrast mode (accessibility)

5. Add Global Keyboard Shortcuts:
   - Cmd+K: Search
   - Cmd+1-6: Jump to pages (Dashboard, Calendar, etc.)
   - Cmd+,: Open settings
   - Cmd+N: New booking/guest (contextual)
   - Escape: Close modals, clear selection
   - Show shortcut hints in tooltips on hover

DESIGN SPECIFICS:
- Command palette: 640px width max, 70vh height max
- Notifications panel: 380px width, shows last 20 notifications
- User dropdown: 220px width, shadow-lg
- Theme transition: 200ms for color changes
- Keyboard shortcut hints: Small badge on hover, shows key combo
```

### **STAGE 4: PERFORMANCE & ACCESSIBILITY**

```
CONTEXT: The layout must be fast, accessible, and work for all users including those with disabilities.

TECH REQUIREMENTS:
- Implement lazy loading for layout components
- Add ARIA labels and keyboard navigation
- Optimize re-renders with React.memo
- Add focus management and skip links

EXACT IMPLEMENTATION STEPS:

1. Optimize performance:
   - Lazy load non-critical layout components (notification panel, command palette)
   - Implement React.memo for static layout parts
   - Use CSS containment for isolated scrolling regions
   - Optimize images: WebP format, lazy loading, responsive sizes

2. Implement accessibility features:
   - ARIA labels for all interactive elements
   - Keyboard navigation: Tab through focusable elements
   - Skip link: #main-content skip for screen readers
   - Focus trapping in modals
   - High contrast mode support

3. Add focus management:
   - Focus returns to trigger after closing modals
   - Focus moves to main content after navigation
   - Announce page changes to screen readers
   - Maintain focus order logical to DOM

4. Create loading states:
   - Skeleton screens for initial page loads
   - Progress indicators for async operations
   - Optimistic updates for quick actions
   - Error boundaries with helpful messages

5. Implement offline support:
   - Detect offline status and show indicator
   - Cache layout resources (icons, fonts, CSS)
   - Queue actions taken while offline
   - Sync when connection restored

DESIGN SPECIFICS:
- Focus ring: Blue-500, 2px width, offset 2px
- Skip link: Position absolute, left top, hidden until focused
- High contrast mode: Use system colors, increase contrast ratio
- Skeleton: Match final layout exactly, subtle shimmer animation
- Offline indicator: Fixed bottom-right, amber color, auto-hide after 5s
```

---



## **💰 PAGE 6: BILLING & INVOICING**

### **📋 FEATURES LIST**

1. **Living Folio** - Real-time updates as charges added
2. **Timeline View** - Chronological, not spreadsheet
3. **Smart Splitting** - Drag charges between guests
4. **Natural Language Charges** - "2 cokes to room 202"
5. **Payment Allocation** - Apply payments to specific charges
6. **Digital Receipts** - Beautiful, shareable invoices
7. **Tax Management** - Multiple rates, exemptions, breakdown
8. **Corporate Billing** - Direct to company, purchase orders
9. **Dispute Resolution** - In-app charge disputes
10. **Accounting Integration** - QuickBooks, Xero, SAP

### **🎨 WIREFRAME LAYOUT**

```
┌─────────────────────────────────────────────────────┐
│ 💰 Folio • Sarah Chen • Room 202 • Stay #4821       │
├─────────────────────────────────────────────────────┤
│ [Live View][Finalize][Print/Email][History]         │
├─────┬───────────────────────────────────────────────┤
│     │                                               │
│GUEST│               LIVING FOLIO                    │
│VIEW │  DEC 15 • Arrival Day                        │
│─────│   3:15 PM • Check-in                         │
│🟣VIP│     Room 202 • King Suite • 3 nights         │
│📧   │     $189/night × 3 = $567                    │
│💳***│   4:30 PM • Mini-bar                         │
│4242 │     Coca-Cola • $4                           │
│     │     Water • $3                               │
│STATS│   7:45 PM • Room Service                     │
│─────│     Caesar Salad • $18                       │
│Total│     Wine • $32                               │
│$832 │                                               │
│Paid │  DEC 16 • Day 2                              │
│$500 │   [Add Charge] [Add Note]                    │
│Due  │                                               │
│$332 │                                               │
├─────┤               QUICK ACTIONS                   │
│SUMMARY│  ┌─────────────────────────────────────────┐ │
│──────│  │ Split Bill:                            │ │
│Room  │  │ [By Person][Category][Custom]          │ │
│$567  │  │                                         │ │
│Food  │  │ Apply:                                 │ │
│$50   │  │ [Discount 10%][Service Charge 15%]     │ │
│Bar   │  │ [Tax Exempt][Comp]                     │ │
│$125  │  │                                         │ │
│Tax   │  │ Payment:                               │ │
│$90   │  │ [Partial $100][Full $332]              │ │
│Total │  │ [Transfer to Company]                  │ │
│$832  │  └─────────────────────────────────────────┘ │
└─────┴───────────────────────────────────────────────┘
```

## **🎯 STAGE-WISE IMPLEMENTATION PROMPTS**

### **STAGE 1: BUILD FOLIO STRUCTURE & REAL-TIME UPDATES**

```
CONTEXT: Create a billing system that shows charges in real-time as they occur, not just at checkout. Each charge should have context: who, when, where, why.

TECH REQUIREMENTS:
- Three-panel layout: Guest info, Timeline, Actions
- Real-time WebSocket updates for new charges
- Chronological timeline view (not spreadsheet)
- Live total calculation and payment tracking

EXACT IMPLEMENTATION STEPS:

1. Create folio page structure:
   - Create `src/pages/Billing/Billing.tsx`
   - Three columns: Guest (25%), Timeline (50%), Actions (25%)
   - Four view modes: Live (editable), Final (read-only), Print preview, History
   - Real-time connection: WebSocket for instant charge updates

2. Build timeline folio view:
   - Group charges by day (expandable day sections)
   - Each charge: Time, description, amount, staff who added
   - Visual indicators: Color-coded by category (room, food, spa, etc.)
   - Expandable details: Click charge for full details and notes

3. Implement real-time updates:
   - WebSocket subscription to 'folio-updates:{reservationId}'
   - New charges appear with slide-in animation
   - Updated charges pulse briefly
   - Deleted charges fade out and disappear

4. Create guest context panel:
   - Guest photo/avatar and contact info
   - Payment methods on file with last transaction
   - Credit limit and current balance
   - Payment history and trend

5. Add summary panel:
   - Category totals with expandable breakdown
   - Tax breakdown (city, state, tourism, service)
   - Payment summary: Paid, due, credits, deposits
   - Projected total based on stay patterns

DESIGN SPECIFICS:
- Timeline layout: Vertical, left-aligned times, right-aligned amounts
- Charge cards: White background, shadow-sm, hover shadow-md
- Real-time indicator: Blue dot pulsing for new charges
- Category colors: Room (blue), Food (green), Spa (purple), Other (gray)
- Payment status: Progress bar showing paid vs due
```

### **STAGE 2: IMPLEMENT CHARGE MANAGEMENT & NATURAL LANGUAGE**

```
CONTEXT: Adding charges should be fast and intuitive. Staff should be able to type natural language ("2 cokes to room 202") instead of filling forms.

TECH REQUIREMENTS:
- Natural language processing for charge entry
- Quick charge buttons for common items
- Charge validation and approval workflows
- Photo receipt attachment and OCR

EXACT IMPLEMENTATION STEPS:

1. Create natural language charge entry:
   - Text input: "Add 2 cokes to room 202"
   - Parse with regex/NLP: quantity, item, room, optional price
   - Auto-lookup: Item database for price, tax category
   - Preview before adding: Show parsed charge details
   - Confirm with one click

2. Implement quick charge buttons:
   - Common items: Breakfast, Parking, Mini-bar, Room Service
   - Category-based: Restaurant, Bar, Spa, Activities
   - Custom: Opens quick form with item search
   - Recent: Last 10 charges added (for repeat items)

3. Add charge validation:
   - Price limits: Flag charges over $X for manager approval
   - Duplicate detection: Warn if similar charge added recently
   - Tax validation: Ensure correct tax applied based on item/location
   - Permission check: Some staff can't add certain charge types

4. Create receipt management:
   - Photo upload: Take picture of paper receipt
   - OCR extraction: Auto-fill charge details from receipt
   - Receipt storage: Attached to charge for audit trail
   - Receipt matching: Match uploaded receipt to existing charge

5. Implement approval workflows:
   - Manager approval required for: Large amounts, comps, discounts
   - Approval queue: Managers see pending approvals
   - Approval history: Who approved what and when
   - Auto-approval: Based on staff role and amount thresholds

DESIGN SPECIFICS:
- Natural language input: Large textarea with placeholder examples
- Parse preview: Card showing interpreted charge details
- Quick charge grid: 3x3 grid of common items with icons
- Receipt preview: Thumbnail with OCR extracted text overlay
- Approval badge: Orange "Pending" badge on unapproved charges
```

### **STAGE 3: ADD PAYMENT PROCESSING & ALLOCATION**

```
CONTEXT: Payments need to be flexible: multiple methods, partial payments, split across guests, and allocated to specific charges.

TECH REQUIREMENTS:
- Multiple payment method support
- Payment allocation to specific charges
- Split payment across methods/guests
- Refund processing with audit trail

EXACT IMPLEMENTATION STEPS:

1. Implement payment method support:
   - Credit/debit cards: Saved cards, new cards (with scanner)
   - Cash: Opens cash drawer integration, calculates change
   - Mobile wallets: Apple Pay, Google Pay, Samsung Pay
   - Vouchers/credits: Apply loyalty points, gift certificates
   - Corporate billing: Direct to company account

2. Create payment allocation system:
   - Apply payment to specific charges (click charges to select)
   - Partial payments: Pay $100 now, rest later
   - Overpayments: Handle as credit for future stays
   - Auto-allocation: Oldest charges first, highest first, or proportional

3. Add split payment functionality:
   - Split by guest: Divide among multiple guests on reservation
   - Split by category: Room to one card, food to another
   - Split by percentage: 70/30, 50/50, etc.
   - Save split templates for common scenarios (corporate travel)

4. Implement refund processing:
   - Full or partial refunds
   - Refund reason tracking: Dispute, error, goodwill
   - Refund method: Original payment method or alternative
   - Refund approval workflow for large amounts

5. Create payment history and reconciliation:
   - Complete payment history with timestamps
   - Reconciliation reports: Daily, weekly, monthly
   - Discrepancy detection: Flag mismatched amounts
   - Integration with accounting software

DESIGN SPECIFICS:
- Payment method selector: Card carousel for saved methods
- Allocation interface: Charge list with checkboxes for selection
- Split visualization: Pie chart or bar chart showing division
- Refund flow: Step-by-step with confirmation screens
- Payment history: Table with filter by date, method, staff
```

### **STAGE 4: IMPLEMENT TAX MANAGEMENT & ACCOUNTING INTEGRATION**

```
CONTEXT: Tax compliance is critical. Need to handle multiple tax rates, exemptions, and integrate with accounting systems.

TECH REQUIREMENTS:
- Multiple tax rate management (city, state, tourism, service)
- Tax exemption handling and documentation
- Accounting software integration (QuickBooks, Xero)
- Audit-ready reporting and documentation

EXACT IMPLEMENTATION STEPS:

1. Create tax management system:
   - Multiple tax rates per jurisdiction
   - Tax categories: Room tax, food tax, service charge
   - Inclusive vs exclusive pricing toggle
   - Tax calculation: Auto-calculate based on item category and location

2. Implement tax exemption handling:
   - Government rates: Federal, state, municipal employees
   - Diplomatic exemptions: With proper documentation
   - Non-profit organizations: With tax-exempt certificate
   - Document storage: Upload and attach exemption certificates

3. Add accounting integration:
   - QuickBooks Online/Desktop integration
   - Xero integration
   - SAP integration for enterprise
   - Automated journal entry creation
   - Chart of accounts mapping

4. Create audit-ready reports:
   - Daily tax collection report
   - Tax exemption report by reason
   - Audit trail: Every change logged with user and timestamp
   - Data export: CSV, Excel, PDF for auditors

5. Implement compliance features:
   - Police reporting integration (varies by country)
   - Tourist tax collection and remittance
   - GDPR compliance for guest data
   - PCI compliance for payment data

DESIGN SPECIFICS:
- Tax breakdown: Expandable section showing each tax type and amount
- Exemption badges: Color-coded badges on guest profile and folio
- Integration status: Green checkmark for connected, red X for disconnected
- Report preview: In-browser PDF preview before printing/exporting
- Compliance indicators: Shield icons for PCI, GDPR, tax compliance
```

---

## **📦 SHARED COMPONENTS LIBRARY**

### **🎯 CORE COMPONENTS TO BUILD**

### **1. RoomCard Component**

```jsx
// Props: roomNumber, status, guest, rate, onClick, onContextMenu
// Features: Color-coded status, guest initials, hover effects, drag handle
// States: Normal, Selected, Hover, Dragging, Disabled
// Mobile: Swipe actions, touch feedback
```

### **2. GuestCard Component**

```jsx
// Props: name, avatar, status, stays, ltv, onClick
// Features: Avatar with status badge, quick stats, hover details
// States: Normal, Selected, Compact, Expanded
// Mobile: Tap for details, long press for actions
```

### **3. ChargeCard Component**

```jsx
// Props: description, amount, time, category, staff, editable
// Features: Expandable details, edit inline, drag handle for splitting
// States: Normal, Editing, Selected, Disputed
// Mobile: Swipe to dispute or edit
```

### **4. ContextFooter Component**

```jsx
// Props: context, actions, autoHide, position
// Features: Dynamic based on page/selection, quick action buttons, auto-hide timer
// States: Visible, Hidden, Minimized
// Mobile: Bottom sheet behavior
```

### **5. CommandPalette Component**

```jsx
// Props: open, onClose, commands
// Features: Fuzzy search, command categories, keyboard navigation
// States: Open, Searching, Executing
// Mobile: Full-screen overlay
```

---

## **⚡ PERFORMANCE OPTIMIZATION GUIDE**

### **1. Initial Load Optimization**

- Lazy load page components with React.lazy()
- Code splitting by route and feature
- Preload critical assets (fonts, icons)
- Implement service worker for caching

### **2. Runtime Performance**

- Virtualize long lists (react-window)
- Debounce rapid user inputs
- Use Web Workers for heavy calculations
- Implement request deduplication

### **3. Memory Management**

- Clean up event listeners and subscriptions
- Implement pagination for large datasets
- Use WeakMap for temporary caching
- Monitor memory leaks in development

### **4. Network Optimization**

- Implement request batching
- Use HTTP/2 or HTTP/3
- Compress API responses (gzip, brotli)
- Implement smart polling instead of constant connections

---

## **🧪 TESTING & QA CHECKLIST**

### **1. Unit Tests**

- Test all utility functions
- Test component rendering with different props
- Test edge cases and error states
- Achieve >80% code coverage

### **2. Integration Tests**

- Test page flows (check-in, check-out, billing)
- Test API integrations
- Test WebSocket connections
- Test third-party integrations

### **3. E2E Tests**

- Full user journeys with Cypress
- Cross-browser testing
- Mobile device testing
- Performance testing under load

### **4. Accessibility Testing**

- Screen reader compatibility
- Keyboard navigation
- Color contrast verification
- Focus management testing

---

## **🚀 DEPLOYMENT & MAINTENANCE**

### **1. Build Process**

- Docker containerization
- Multi-stage builds for optimization
- Environment-specific configurations
- Automated build notifications

### **2. Deployment Strategy**

- Blue-green deployment for zero downtime
- Feature flags for gradual rollouts
- Rollback capabilities
- Health checks and monitoring

### **3. Monitoring & Alerting**

- Real-time error tracking (Sentry)
- Performance monitoring (New Relic)
- User analytics (Mixpanel/Amplitude)
- Custom business metrics dashboard

### **4. Maintenance Plan**

- Regular dependency updates
- Security patch management
- Database backup and restore testing
- Disaster recovery procedures

---

## **📊 SUCCESS METRICS & KPIs**

### **1. User Adoption Metrics**

- Daily active users
- Feature usage statistics
- User satisfaction scores
- Training time reduction

### **2. Operational Efficiency**

- Check-in time reduction
- Billing error reduction
- Housekeeping efficiency improvement
- Upsell conversion increase

### **3. Business Impact**

- Revenue per available room (RevPAR) increase
- Guest satisfaction score improvement
- Staff turnover reduction
- Operational cost reduction

### **4. Technical Metrics**

- Page load time (< 3 seconds)
- Time to interactive (< 5 seconds)
- Error rate (< 0.1%)
- Uptime (> 99.9%)

---

## **🎯 IMPLEMENTATION ROADMAP**

### **Phase 1: MVP (Weeks 1-8)**

- Basic layout and navigation
- Dashboard with live metrics
- Simple check-in/check-out
- Basic billing and invoicing

### **Phase 2: Core Features (Weeks 9-16)**

- Advanced calendar with drag-drop
- Room management with floor plan
- Guest profiles with timeline
- Housekeeping integration

### **Phase 3: Advanced Features (Weeks 17-24)**

- Smart upselling and recommendations
- Mobile apps for staff and guests
- Advanced reporting and analytics
- Third-party integrations

### **Phase 4: Optimization & Scale (Weeks 25-32)**

- Performance optimization
- Multi-property support
- Enterprise features
- White-label capabilities

---

## **✅ FINAL DELIVERABLES**

### **1. Documentation**

- Complete API documentation
- User manuals for each role
- Admin configuration guide
- Troubleshooting guide

### **2. Training Materials**

- Video tutorials for common tasks
- Interactive onboarding walkthrough
- Quick reference cards
- Certification program for power users

### **3. Support Resources**

- Knowledge base with search
- Community forum
- Live chat integration
- Dedicated support portal

### **4. Marketing Assets**

- Feature comparison with competitors
- Case studies and testimonials
- Demo environment
- Sales enablement materials

---

**IMPLEMENTATION COMPLETE**

This comprehensive guide provides everything needed to build a modern Hotel Management SaaS platform from scratch. Each page includes:

1. **Complete features list** (10+ features per page)
2. **Detailed wireframe layouts** (ASCII art + descriptions)
3. **Stage-wise implementation prompts** (4 stages per page, each with exact steps)
4. **Design specifics** (colors, spacing, animations, interactions)
5. **Mobile optimization requirements**
6. **Performance considerations**

The system is designed to be:

- **Fast**: Sub-second interactions, real-time updates
- **Intuitive**: Max 2 clicks to common actions, visual over textual
- **Modern**: Clean design, dark mode, responsive
- **Powerful**: Full feature set covering all hotel operations

**Next Steps for Development Team:**

1. Set up project structure and design system
2. Implement MainLayout with all navigation components
3. Build Dashboard page first (establishes patterns)
4. Implement Calendar page (most complex interactions)
5. Continue with Rooms, Guest Profile, Check-in, Billing
6. Add shared components as needed
7. Implement backend API integration
8. Test, optimize, and deploy

**Estimated Development Time:** 32 weeks (8 months) for complete platform
**Team Size Recommended:** 4-6 developers, 1 UX designer, 1 QA tester
**Technology Stack:** React 18+, TypeScript, MUI v5, Tailwind CSS, React Query, [Socket.io](http://socket.io/), Node.js/Express or Python/FastAPI backend