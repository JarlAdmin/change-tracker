import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Change } from '../types/change';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddChangeDialogProps {
  onAddChange: (change: Omit<Change, 'id'>) => void;
}

const AddChangeDialog: React.FC<AddChangeDialogProps> = ({ onAddChange }) => {
  const [open, setOpen] = useState(false);
  const [changeDetails, setChangeDetails] = useState('');
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [changeDate, setChangeDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeDetails.trim() && category.trim() && service.trim() && username.trim()) {
      onAddChange({ 
        change_details: changeDetails, 
        category, 
        service, 
        username, 
        date: changeDate.toISOString() 
      });
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setChangeDetails('');
    setCategory('');
    setService('');
    setUsername('');
    setChangeDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Change</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Change</DialogTitle>
          <DialogDescription>
            Enter the details for the new change here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Change Date and Time</Label>
            <DatePicker
              selected={changeDate}
              onChange={(date: Date | null) => date && setChangeDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="change_details" className="text-right">
              Details
            </label>
            <Textarea
              id="change_details"
              value={changeDetails}
              onChange={(e) => setChangeDetails(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right">
              Category
            </label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="service" className="text-right">
              Service
            </label>
            <Input
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Change</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChangeDialog;
