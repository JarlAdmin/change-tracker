import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Change } from '../types/change';
import { CategoryWithIcon, ServiceWithIcon } from './ServiceIcon';
import { UserAvatar } from './UserAvatar';
import axios from 'axios';
import { useCategoriesAndServices } from '@/hooks/useCategoriesAndServices';
import { IconComponent } from './IconComponent';

interface ViewChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  change: Change;
}

const ViewChangeDialog: React.FC<ViewChangeDialogProps> = ({ isOpen, onClose, change }) => {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const { categories, services } = useCategoriesAndServices();
  const screenshots = change.screenshots || [];

  const category = categories.find(c => c.name === change.category);
  const service = services.find(s => s.name === change.service);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://10.85.0.100:3001/api/users/${change.user_id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (change.user_id) {
      fetchUser();
    }
  }, [change.user_id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Change Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Change Details</h3>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {change.change_details}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Category</h3>
              <div className="flex items-center gap-2">
                {category && <IconComponent iconName={category.icon} />}
                <span>{change.category}</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Service</h3>
              <div className="flex items-center gap-2">
                {service && <IconComponent iconName={service.icon} />}
                <span>{change.service}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Date</h3>
              <p>{new Date(change.date).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">User</h3>
              {user && (
                <div className="flex items-center gap-2">
                  <UserAvatar username={user.username} />
                  <span>{user.username}</span>
                </div>
              )}
            </div>
          </div>
          {screenshots.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Screenshots</h3>
              <div className="grid grid-cols-2 gap-4">
                {screenshots
                  .filter(screenshot => screenshot.filepath)
                  .map((screenshot, index) => (
                    <a 
                      key={index}
                      href={`http://10.85.0.100:3001${screenshot.filepath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={`http://10.85.0.100:3001${screenshot.filepath}`}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-auto rounded-md border hover:border-primary transition-colors"
                      />
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewChangeDialog;
