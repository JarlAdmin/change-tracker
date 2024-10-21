import React, { useState, useCallback, useEffect } from 'react';
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
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Change } from '../types/change';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChange: (change: Omit<Change, 'id'>) => void;
}

const AddChangeDialog: React.FC<AddChangeDialogProps> = ({ isOpen, onClose, onAddChange }) => {
  const [changeDetails, setChangeDetails] = useState('');
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [changeDate, setChangeDate] = useState<Date>(new Date());
  const [userName, setUserName] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setScreenshots(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDetails.trim() || !category || !userName.trim()) {
      setError("Please fill in all required fields (Change Details, Category, and User Name).");
      return;
    }
    if (category !== 'General Changes' && !service) {
      setError("Please select a service for the chosen category.");
      return;
    }
    onAddChange({
      change_details: changeDetails,
      category,
      service: category === 'General Changes' ? 'General Change' : service,
      date: changeDate.toISOString(),
      username: userName,
      screenshots,
    });
    handleClose();
  };

  const handleClose = () => {
    setChangeDetails('');
    setCategory('');
    setService('');
    setChangeDate(new Date());
    setUserName('');
    setScreenshots([]);
    setError(null);
    onClose();
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Change</DialogTitle>
          <DialogDescription>
            Enter the details of the new change here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="change-details">Change Details*</Label>
            <Textarea
              id="change-details"
              placeholder="Describe the change..."
              value={changeDetails}
              onChange={(e) => setChangeDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category*</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Microsoft">Microsoft</SelectItem>
                <SelectItem value="On Premise">On Premise</SelectItem>
                <SelectItem value="General Changes">General Changes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(category === 'Microsoft' || category === 'On Premise') && (
            <div className="space-y-2">
              <Label htmlFor="service">Service*</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {category === 'Microsoft' && (
                    <>
                      <SelectItem value="Azure">Azure</SelectItem>
                      <SelectItem value="Intune">Intune</SelectItem>
                      <SelectItem value="Exchange">Exchange</SelectItem>
                      <SelectItem value="Defender">Microsoft Defender</SelectItem>
                      <SelectItem value="Entra">Microsoft Entra</SelectItem>
                      <SelectItem value="Teams">Microsoft Teams</SelectItem>
                    </>
                  )}
                  {category === 'On Premise' && (
                    <>
                      <SelectItem value="Active Directory">Active Directory</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
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
          <div className="space-y-2">
            <Label htmlFor="user-name">User Name*</Label>
            <Input
              id="user-name"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Screenshots</Label>
            <div className="flex flex-wrap gap-2">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="relative">
                  <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-20 h-20 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={() => removeScreenshot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Paste screenshots here</p>
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
