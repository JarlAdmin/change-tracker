import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  username: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ username, className }) => {
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
    <Avatar className={`h-8 w-8 ${getRandomColor(username)} ${className}`}>
      <AvatarFallback className="text-white">
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  );
};
