import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css'; // Import our custom styles
import { Button } from './ui/button';
import { X, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DateTimeFilterProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onClear: () => void;
}

const DateTimeFilter: React.FC<DateTimeFilterProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <div className="flex items-center">
        <div className={cn(
          "flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "hover:bg-accent hover:text-accent-foreground"
        )}>
          <div className="flex items-center gap-2 w-full">
            <Calendar className="h-4 w-4 opacity-50" />
            <DatePicker
              selected={value}
              onChange={onChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Filter by date & time"
              isClearable={false}
              className="w-full bg-transparent border-none focus:outline-none p-0"
              customInput={
                <input
                  className="w-full bg-transparent border-none focus:outline-none cursor-pointer"
                />
              }
            />
          </div>
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeFilter;
