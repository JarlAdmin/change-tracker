import React, { useState, useCallback } from 'react';
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Change } from '../types/change';
import EditChangeDialog from './EditChangeDialog';
import ViewChangeDialog from './ViewChangeDialog';

interface RowActionsProps {
  change: Change;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedChange: FormData) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ change, onDelete, onEdit }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleEdit = useCallback((id: number, updatedChange: FormData) => {
    onEdit(id, updatedChange);
    setIsEditDialogOpen(false);
  }, [onEdit]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
            View Change
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(change.id)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isEditDialogOpen && (
        <EditChangeDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onEditChange={handleEdit}
          change={change}
        />
      )}
      {isViewDialogOpen && (
        <ViewChangeDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          change={change}
        />
      )}
    </>
  );
};

export default React.memo(RowActions);
