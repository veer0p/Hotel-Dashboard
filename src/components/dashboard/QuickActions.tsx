import React from 'react';
import { Plus, UserCheck, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-3 z-50">
      {/* Secondary actions */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <UserMinus className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Check Out</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <UserCheck className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Check In</TooltipContent>
      </Tooltip>

      {/* Primary action */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all gradient-primary"
            onClick={() => navigate('/bookings/new')}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">New Booking</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default QuickActions;
