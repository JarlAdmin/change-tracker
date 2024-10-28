import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "./ui/label";
import { useAuth } from '@/contexts/AuthContext';

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
  const [newPassword, setNewPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();

  const isAdmin = currentUser?.username === 'Admin';

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
    if (!newUsername.trim() || !newPassword.trim()) {
      toast.error('Username and password are required');
      return;
    }

    try {
      const response = await axios.post('http://10.85.0.100:3001/api/users', {
        username: newUsername,
        password: newPassword
      });
      setUsers([...users, response.data]);
      setNewUsername('');
      setNewPassword('');
      toast.success('User added successfully');
    } catch (error) {
      toast.error('Error adding user');
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

  const updatePassword = async () => {
    if (!selectedUserId || !newPassword.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      await axios.put(`http://10.85.0.100:3001/api/users/${selectedUserId}/password`, {
        password: newPassword,
        requestingUser: currentUser?.username // Add this to verify on server
      });
      setNewPassword('');
      setSelectedUserId(null);
      setIsPasswordDialogOpen(false);
      toast.success('Password updated successfully');
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error updating password');
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

  const canChangePassword = (targetUser: User) => {
    // Admin can change any user's password
    if (currentUser?.username === 'Admin') {
      return true;
    }
    // Non-admin users can only change their own password
    return currentUser?.id === targetUser.id;
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
          {/* Only show Add User section if current user is Admin */}
          {isAdmin && (
            <div className="flex items-center space-x-4 p-4 bg-secondary/20 rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Enter username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button onClick={addUser} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          )}

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
                  <div className="flex items-center space-x-2">
                    {canChangePassword(user) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsPasswordDialogOpen(true);
                        }}
                      >
                        Change Password
                      </Button>
                    )}
                    {user.username !== 'Admin' && isAdmin && (
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
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter a new password for the selected user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={updatePassword}>Update Password</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
