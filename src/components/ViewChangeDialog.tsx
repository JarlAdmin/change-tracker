import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Change } from '../types/change'
import axios from 'axios';
import { UserAvatar } from './UserAvatar';
import { CategoryWithIcon, ServiceWithIcon } from './ServiceIcon';

interface ViewChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  change: Change | null;
}

const ViewChangeDialog: React.FC<ViewChangeDialogProps> = ({ isOpen, onClose, change }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (change) {
      fetchUsername(change.user_id);
    }
  }, [change]);

  const fetchUsername = async (userId: number) => {
    try {
      const response = await axios.get(`http://10.85.0.100:3001/api/users/${userId}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername('Unknown');
    }
  };

  if (!change) return null;

  const validScreenshots = change.screenshots.filter(screenshot => screenshot.id !== null && screenshot.filepath !== null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>View Change Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected change.
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardHeader>
              <CardTitle>Change #{change.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Change Details</Label>
                <p className="text-sm">{change.change_details}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <div className="text-sm">
                    <CategoryWithIcon category={change.category} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Service</Label>
                  <div className="text-sm">
                    <ServiceWithIcon 
                      category={change.category} 
                      service={change.service} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Change Date</Label>
                  <p className="text-sm">
                    {new Date(change.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>User</Label>
                  <div className="flex items-center gap-2">
                    {username && <UserAvatar username={username} size="sm" />}
                    <p className="text-sm">{username}</p>
                  </div>
                </div>
              </div>
              {validScreenshots.length > 0 && (
                <div className="space-y-1">
                  <Label>Screenshots</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {validScreenshots.map((screenshot, index) => (
                      <img 
                        key={index} 
                        src={`http://10.85.0.100:3001${screenshot.filepath}`}
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-auto object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(`http://10.85.0.100:3001${screenshot.filepath}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Screenshot Preview</DialogTitle>
            </DialogHeader>
            <img src={selectedImage} alt="Selected screenshot" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default ViewChangeDialog
