import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  Users,
  Gift,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Hotel,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarContext } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Bookings', href: '/bookings', icon: Calendar },
  { title: 'Rooms', href: '/rooms', icon: DoorOpen },
  { title: 'Guests', href: '/guests', icon: Users },
  { title: 'Decorations', href: '/decorations', icon: Gift },
  { title: 'Calendar', href: '/calendar', icon: CalendarDays },
  { title: 'Reports', href: '/reports', icon: BarChart3 },
  { title: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebarContext();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b border-sidebar-border",
        isCollapsed && "justify-center px-2"
      )}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Hotel className="w-6 h-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-fadeIn">
            <span className="font-semibold text-foreground">Grand Palace</span>
            <span className="text-xs text-muted-foreground">Hotel Admin</span>
          </div>
        )}
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={closeMobile}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center justify-center w-full h-11 rounded-lg transition-all duration-200",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={closeMobile}
              className={cn(
                "nav-item",
                active ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="animate-fadeIn">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        isCollapsed && "px-2"
      )}>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="w-full flex items-center justify-center h-11 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary">AU</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden md:flex border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className={cn(
            "w-full justify-center text-muted-foreground hover:text-foreground",
            !isCollapsed && "justify-end"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <span className="mr-2 text-xs">Collapse</span>
              <ChevronLeft className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 ease-out",
          isCollapsed ? "w-20" : "w-[280px]"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
