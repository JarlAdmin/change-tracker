import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface DateTimeFilterProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onClear: () => void;
}

const DateTimeFilter: React.FC<DateTimeFilterProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <Label htmlFor="date-filter" className="sr-only">Filter by date</Label>
      <div className="flex items-center gap-2">
        <DatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="Filter by date & time"
          isClearable={false}
          className="w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateTimeFilter;
