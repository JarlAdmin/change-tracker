import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
import { UserAvatar } from './UserAvatar';

interface Screenshot {
  id: number;
  filepath: string;
}

interface EditChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditChange: (id: number, updatedChange: FormData) => void;
  change: Change;
}

const EditChangeDialog: React.FC<EditChangeDialogProps> = ({ isOpen, onClose, onEditChange, change }) => {
  const [changeDetails, setChangeDetails] = useState(change.change_details);
  const [category, setCategory] = useState(change.category);
  const [service, setService] = useState(change.service);
  const [changeDate, setChangeDate] = useState<Date>(new Date(change.date));
  const [userId, setUserId] = useState<number>(change.user_id);
  const [screenshots, setScreenshots] = useState<Screenshot[]>(change.screenshots.filter(screenshot => screenshot.id !== null && screenshot.filepath !== null) || []);
  const [newScreenshots, setNewScreenshots] = useState<File[]>([]);
  const [users, setUsers] = useState<Array<{ id: number, username: string }>>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const initializeState = useCallback(() => {
    console.log('Change object:', change);
    console.log('Screenshots:', change.screenshots);
    
    setChangeDetails(change.change_details);
    setCategory(change.category);
    setService(change.service);
    setChangeDate(new Date(change.date));
    setUserId(change.user_id);
    setScreenshots(change.screenshots.filter(screenshot => screenshot.id !== null && screenshot.filepath !== null) || []);
    setNewScreenshots([]);
  }, [change]);

  useEffect(() => {
    if (isOpen) {
      initializeState();
    }
  }, [isOpen, initializeState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeDetails.trim() && category.trim() && service.trim() && userId) {
      const formData = new FormData();
      formData.append('change_details', changeDetails);
      formData.append('category', category);
      formData.append('service', service);
      formData.append('user_id', userId.toString());
      formData.append('date', changeDate.toISOString());
      formData.append('existing_screenshots', JSON.stringify(screenshots));
      newScreenshots.forEach(file => formData.append('screenshots', file));

      onEditChange(change.id, formData);
      onClose();
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => {
      const updatedScreenshots = prev.filter((_, i) => i !== index);
      // If all screenshots are removed, return an empty array
      return updatedScreenshots.length > 0 ? updatedScreenshots : [];
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewScreenshots(Array.from(event.target.files));
    }
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
            <Label htmlFor="change-date">Change Date and Time</Label>
            <div className="relative">
              <DatePicker
                selected={changeDate}
                onChange={(date: Date | null) => date && setChangeDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                id="change-date"
                wrapperClassName="w-full"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-id">User</Label>
            <Select value={userId.toString()} onValueChange={(value) => setUserId(Number(value))}>
              <SelectTrigger id="user-id">
                <SelectValue placeholder="Select User">
                  {users.find(u => u.id === userId) && (
                    <div className="flex items-center gap-2">
                      <UserAvatar username={users.find(u => u.id === userId)!.username} />
                      <span>{users.find(u => u.id === userId)!.username}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <UserAvatar username={user.username} />
                      <span>{user.username}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {screenshots.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="screenshots">Existing Screenshots</Label>
              <div className="flex flex-wrap gap-2">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={`http://10.85.0.100:3001${screenshot.filepath}`}
                      alt={`Screenshot ${index + 1}`} 
                      className="w-20 h-20 object-cover" 
                      onError={() => removeScreenshot(index)}
                    />
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
          )}
          <div className="space-y-2">
            <Label htmlFor="new-screenshots">Add New Screenshots</Label>
            <Input
              id="new-screenshots"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {newScreenshots.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`New Screenshot ${index + 1}`} className="w-20 h-20 object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={() => setNewScreenshots(prev => prev.filter((_, i) => i !== index))}
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

export default React.memo(EditChangeDialog);
