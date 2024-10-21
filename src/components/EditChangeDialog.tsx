import React, { useState, useEffect } from 'react';
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
import { Change } from '../types/change';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from "lucide-react";

interface EditChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditChange: (id: number, updatedChange: Omit<Change, 'id'>) => void;
  change: Change;
}

const EditChangeDialog: React.FC<EditChangeDialogProps> = ({ isOpen, onClose, onEditChange, change }) => {
  const [changeDetails, setChangeDetails] = useState(change.change_details);
  const [category, setCategory] = useState(change.category);
  const [service, setService] = useState(change.service);
  const [changeDate, setChangeDate] = useState<Date>(new Date(change.date));
  const [userName, setUserName] = useState(change.username);
  const [screenshots, setScreenshots] = useState<string[]>(change.screenshots || []);

  useEffect(() => {
    setChangeDetails(change.change_details);
    setCategory(change.category);
    setService(change.service);
    setChangeDate(new Date(change.date));
    setUserName(change.username);
    setScreenshots(change.screenshots || []);
  }, [change]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeDetails.trim() && category.trim() && service.trim() && userName.trim()) {
      onEditChange(change.id, {
        change_details: changeDetails,
        category,
        service,
        username: userName,
        date: changeDate.toISOString(),
        screenshots: screenshots,
      });
      onClose();
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Change</DialogTitle>
          <DialogDescription>
            Make changes to the selected item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="change-id">Change ID</Label>
            <Input
              id="change-id"
              value={change.id}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="change-details">Change Details</Label>
            <Textarea
              id="change-details"
              value={changeDetails}
              onChange={(e) => setChangeDetails(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="service">Service</Label>
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
            <Label htmlFor="user-name">User Name</Label>
            <Input
              id="user-name"
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
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChangeDialog;
