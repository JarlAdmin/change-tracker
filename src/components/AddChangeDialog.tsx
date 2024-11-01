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
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, X } from "lucide-react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { UserAvatar } from './UserAvatar';
import { ServiceIcon } from './ServiceIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoriesAndServices } from '@/hooks/useCategoriesAndServices';
import { IconComponent } from './IconComponent';

interface AddChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChange: (change: FormData) => void;
}

const AddChangeDialog: React.FC<AddChangeDialogProps> = ({ isOpen, onClose, onAddChange }) => {
  const [changeDetails, setChangeDetails] = useState('');
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [changeDate, setChangeDate] = useState<Date>(new Date());
  const [userId, setUserId] = useState<number | null>(null);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<{ id: number, username: string }>>([]);
  const { user: currentUser } = useAuth();
  const { categories, services, loading } = useCategoriesAndServices();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/users');
      setUsers(response.data);
      // Set current user as default instead of Admin
      if (currentUser) {
        setUserId(currentUser.id);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // When dialog opens, reset form and set current user
  useEffect(() => {
    if (isOpen && currentUser) {
      setUserId(currentUser.id);
    }
  }, [isOpen, currentUser]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      const validFiles = files.filter(file => allowedTypes.includes(file.type));
      if (validFiles.length !== files.length) {
        setError("Some files were not added. Only JPEG, PNG, GIF, and SVG are allowed.");
      }
      setScreenshots(validFiles);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDetails.trim() || !category || !userId) {
      setError("Please fill in all required fields (Change Details, Category, and User).");
      return;
    }

    const formData = new FormData();
    formData.append('change_details', changeDetails);
    formData.append('category', category);
    formData.append('service', category === 'General Changes' ? 'General Change' : service);
    formData.append('date', changeDate.toISOString());
    formData.append('user_id', userId.toString());
    screenshots.forEach(file => formData.append('screenshots', file));

    onAddChange(formData);
    handleClose();
  };

  const handleClose = () => {
    setChangeDetails('');
    setCategory('');
    setService('');
    setChangeDate(new Date());
    // Don't reset userId to null, instead set it to current user's ID
    setUserId(currentUser?.id || null);
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
            <Select 
              value={selectedCategoryId?.toString() || ''} 
              onValueChange={(value) => {
                const categoryId = Number(value);
                setSelectedCategoryId(categoryId);
                const category = categories.find(c => c.id === categoryId);
                setCategory(category?.name || '');
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    <div className="flex items-center gap-2">
                      <IconComponent iconName={cat.icon} />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCategoryId && categories.find(c => c.id === selectedCategoryId)?.name !== 'General Changes' && (
            <div className="space-y-2">
              <Label htmlFor="service">Service*</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {services
                    .filter(s => s.category_id === selectedCategoryId)
                    .map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        <div className="flex items-center gap-2">
                          <IconComponent iconName={service.icon} />
                          <span>{service.name}</span>
                        </div>
                      </SelectItem>
                    ))}
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
            <Select 
              value={userId?.toString() || ""} 
              onValueChange={(value) => setUserId(Number(value))}
            >
              <SelectTrigger id="user-id">
                <SelectValue placeholder="Select User">
                  {userId && users.find(u => u.id === userId) && (
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
          <div className="space-y-2">
            <Label htmlFor="screenshots">Screenshots</Label>
            <Input
              id="screenshots"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {screenshots.map((file, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(file)} alt={`Screenshot ${index + 1}`} className="w-20 h-20 object-cover" />
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
            <Button type="submit">Add Change</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChangeDialog;
