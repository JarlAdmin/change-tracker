import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Change } from '../types/change';

interface EditChangeDialogProps {
  change: Change;
  onEditChange: (id: number, updatedChange: Omit<Change, 'id' | 'date'>) => void;
}

const EditChangeDialog: React.FC<EditChangeDialogProps> = ({ change, onEditChange }) => {
  const [open, setOpen] = useState(false);
  const [change_details, setChangeDetails] = useState(change.change_details);
  const [category, setCategory] = useState(change.category);
  const [service, setService] = useState(change.service);
  const [username, setUsername] = useState(change.username);

  useEffect(() => {
    setChangeDetails(change.change_details);
    setCategory(change.category);
    setService(change.service);
    setUsername(change.username);
  }, [change]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (change_details.trim() && category.trim() && service.trim() && username.trim()) {
      onEditChange(change.id, { change_details, category, service, username });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Change</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="change_details" className="text-right">
              Details
            </label>
            <Input
              id="change_details"
              value={change_details}
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
          <Button type="submit" className="mt-4">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChangeDialog;
