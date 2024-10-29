import React, { useState, useRef, useEffect } from 'react';
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
import { Change } from '../types/change';
import { ServiceIcon } from './ServiceIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoriesAndServices } from '@/hooks/useCategoriesAndServices';
import { IconComponent } from './IconComponent';

interface EditChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditChange: (id: number, change: FormData) => void;
  change: Change;
}

const EditChangeDialog: React.FC<EditChangeDialogProps> = ({ isOpen, onClose, onEditChange, change }) => {
  const [changeDetails, setChangeDetails] = useState(change.change_details);
  const [category, setCategory] = useState(change.category);
  const [service, setService] = useState(change.service);
  const [changeDate, setChangeDate] = useState<Date>(new Date(change.date));
  const [error, setError] = useState<string | null>(null);
  const [newScreenshots, setNewScreenshots] = useState<File[]>([]);
  const [existingScreenshots, setExistingScreenshots] = useState(change.screenshots || []); // Add default empty array
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { categories, services } = useCategoriesAndServices();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(() => {
    const category = categories.find(c => c.name === change.category);
    return category?.id || null;
  });

  useEffect(() => {
    const category = categories.find(c => c.name === change.category);
    setSelectedCategoryId(category?.id || null);
  }, [categories, change.category]);

  useEffect(() => {
    if (category === 'General Changes') {
      setService('General Change');
    }
  }, [category]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      const validFiles = files.filter(file => allowedTypes.includes(file.type));
      
      if (validFiles.length !== files.length) {
        setError("Some files were not added. Only JPEG, PNG, GIF, and SVG are allowed.");
      }
      setNewScreenshots(validFiles);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeDetails.trim() || !category) {
      setError("Please fill in all required fields (Change Details and Category)");
      return;
    }

    const formData = new FormData();
    formData.append('change_details', changeDetails);
    formData.append('category', category);
    formData.append('service', category === 'General Changes' ? 'General Change' : service);
    formData.append('date', changeDate.toISOString());
    formData.append('user_id', user?.id.toString() || '');
    formData.append('existing_screenshots', JSON.stringify(existingScreenshots));
    
    newScreenshots.forEach(file => {
      formData.append('screenshots', file);
    });

    onEditChange(change.id, formData);
    handleClose();
  };

  const handleClose = () => {
    setChangeDetails(change.change_details);
    setCategory(change.category);
    setService(change.service);
    setChangeDate(new Date(change.date));
    setNewScreenshots([]);
    setExistingScreenshots(change.screenshots || []); // Reset with default empty array
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const removeExistingScreenshot = (screenshotId: number) => {
    setExistingScreenshots(prev => prev.filter(s => s.id !== screenshotId));
  };

  const removeNewScreenshot = (index: number) => {
    setNewScreenshots(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Change</DialogTitle>
          <DialogDescription>
            Make changes to the selected item here. Click save when you're done.
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
            <Label htmlFor="screenshots">Screenshots</Label>
            <Input
              id="screenshots"
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              ref={fileInputRef}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {existingScreenshots.map((screenshot) => (
                screenshot.id && screenshot.filepath && (
                  <div key={screenshot.id} className="relative">
                    <img
                      src={`http://10.85.0.100:3001${screenshot.filepath}`}
                      alt={`Screenshot ${screenshot.id}`}
                      className="w-20 h-20 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6"
                      onClick={() => removeExistingScreenshot(screenshot.id!)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              ))}
              {newScreenshots.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Screenshot ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-6 w-6"
                    onClick={() => removeNewScreenshot(index)}
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
