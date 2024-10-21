import React from 'react';
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Change } from '../types/change';

interface RowActionsProps {
  change: Change;
}

const RowActions: React.FC<RowActionsProps> = ({ change }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(change.id.toString())}
        >
          Copy change ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View change details</DropdownMenuItem>
        <DropdownMenuItem>Edit change</DropdownMenuItem>
        <DropdownMenuItem>Delete change</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActions;
