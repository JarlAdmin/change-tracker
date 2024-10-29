import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Change } from '../types/change';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Undo2, Eye, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from 'react-hot-toast';
import ViewChangeDialog from './ViewChangeDialog';
import { CategoryWithIcon, ServiceWithIcon } from './ServiceIcon';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeletedChangesProps {
  onChangeRestored: () => void;
}

export function DeletedChanges({ onChangeRestored }: DeletedChangesProps) {
  const navigate = useNavigate();
  const [deletedChanges, setDeletedChanges] = useState<Change[]>([]);
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<Array<{ id: number; username: string }>>([]);
  const { user } = useAuth();
  const isAdmin = user?.username === 'Admin';

  const fetchDeletedChanges = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/changes/deleted');
      setDeletedChanges(response.data);
    } catch (error) {
      console.error('Error fetching deleted changes:', error);
      toast.error('Failed to fetch deleted changes');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchDeletedChanges();
    fetchUsers();
  }, []);

  const handleRestore = async (id: number) => {
    try {
      await axios.post(`http://10.85.0.100:3001/api/changes/${id}/restore`);
      toast.success('Change restored successfully');
      fetchDeletedChanges();
      onChangeRestored();
    } catch (error) {
      console.error('Error restoring change:', error);
      toast.error('Failed to restore change');
    }
  };

  const handlePermanentDelete = async (id: number) => {
    try {
      await axios.delete(`http://10.85.0.100:3001/api/changes/${id}/permanent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Change permanently deleted');
      setIsDeleteDialogOpen(false);
      fetchDeletedChanges();
    } catch (error: any) {
      console.error('Error permanently deleting change:', error);
      toast.error(error.response?.data?.message || 'Failed to delete change permanently');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">Deleted Changes</h2>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Change Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date Deleted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedChanges.map((change) => (
              <TableRow key={change.id}>
                <TableCell>{change.id}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="truncate">
                    {change.change_details}
                  </div>
                </TableCell>
                <TableCell>
                  <CategoryWithIcon category={change.category} />
                </TableCell>
                <TableCell>
                  <ServiceWithIcon 
                    category={change.category} 
                    service={change.service} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {users.find(u => u.id === change.user_id) && (
                      <>
                        <UserAvatar username={users.find(u => u.id === change.user_id)!.username} />
                        <span>{users.find(u => u.id === change.user_id)!.username}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {change.deleted_at ? new Date(change.deleted_at).toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedChange(change);
                        setIsViewDialogOpen(true);
                      }}
                      title="View Change"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRestore(change.id)}
                      title="Restore Change"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedChange(change);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Permanently Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {deletedChanges.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No deleted changes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedChange && (
        <>
          <ViewChangeDialog
            isOpen={isViewDialogOpen}
            onClose={() => {
              setIsViewDialogOpen(false);
              setSelectedChange(null);
            }}
            change={selectedChange}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the change
                  and all associated screenshots.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handlePermanentDelete(selectedChange.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
} 