import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const AppLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <TooltipProvider delayDuration={0}>
          <div className="flex min-h-screen w-full bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <TopHeader />
              <main className="flex-1 p-4 md:p-6 overflow-auto">
                <Outlet />
              </main>
            </div>
          </div>
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
