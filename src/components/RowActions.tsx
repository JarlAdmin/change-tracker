import React, { useState } from 'react';
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

interface RowActionsProps {
  change: Change;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedChange: FormData) => void;
}

const RowActions: React.FC<RowActionsProps> = ({ change, onDelete, onEdit }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (id: number, updatedChange: FormData) => {
    onEdit(id, updatedChange);
    setIsEditDialogOpen(false);
  };

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
      <EditChangeDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onEditChange={handleEdit}
        change={change}
      />
    </>
  );
};

export default RowActions;
