import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  username: string;
}

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const addUser = async () => {
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    try {
      await axios.post('http://10.85.0.100:3001/api/users', { username: newUsername });
      toast.success('User added successfully');
      setNewUsername('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const changesResponse = await axios.get(`http://10.85.0.100:3001/api/changes`);
      const userHasChanges = changesResponse.data.some((change: any) => change.user_id === userId);
      
      if (userHasChanges) {
        toast.error('Cannot delete user: This user has associated changes. Please delete or reassign their changes first.');
        return;
      }

      await axios.delete(`http://10.85.0.100:3001/api/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.response?.data?.message) {
        toast.error(`Failed to delete user: ${error.response.data.message}`);
      } else {
        toast.error('Failed to delete user. Please try again.');
      }
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Management</DialogTitle>
          <DialogDescription>
            Manage users and their access to the system.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          {/* Add User Section */}
          <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
            <Input
              placeholder="Enter username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addUser} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* User List Section */}
          <ScrollArea className="flex-1 max-h-[400px] pr-4">
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className={`h-10 w-10 ${getRandomColor(user.username)}`}>
                      <AvatarFallback className="text-white">
                        {getInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
                    </div>
                  </div>
                  {user.username !== 'Admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
