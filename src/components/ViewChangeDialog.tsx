import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Change } from '../types/change';
import { CategoryWithIcon, ServiceWithIcon } from './ServiceIcon';

interface ViewChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  change: Change;
}

const ViewChangeDialog: React.FC<ViewChangeDialogProps> = ({ isOpen, onClose, change }) => {
  // Ensure screenshots is always an array, even if undefined
  const screenshots = change.screenshots || [];

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
              <CategoryWithIcon category={change.category} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Service</h3>
              <ServiceWithIcon category={change.category} service={change.service} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Date</h3>
            <p>{new Date(change.date).toLocaleString()}</p>
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
