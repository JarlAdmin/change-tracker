import React from 'react';
import {
  Server,
  Database,
  Cloud,
  Network,
  Shield,
  Settings,
  Box,
  Cpu,
  HardDrive,
  Monitor,
  Router,
  Lock,
  Key,
  Workflow,
  Terminal,
  Code,
  FileCode,
  Laptop,
  Smartphone,
  Wifi,
  Radio,
  Cog,
  Mail,
  Users
} from "lucide-react";

const ICONS = {
  Server,
  Database,
  Cloud,
  Network,
  Shield,
  Settings,
  Box,
  CPU: Cpu,
  HardDrive,
  Monitor,
  Router,
  Lock,
  Key,
  Workflow,
  Terminal,
  Code,
  FileCode,
  Laptop,
  Smartphone,
  Wifi,
  Radio,
  Cog,
  Mail,
  Users
};

interface IconComponentProps {
  iconName: string;
  className?: string;
}

export const IconComponent: React.FC<IconComponentProps> = ({ iconName, className = "h-4 w-4" }) => {
  const Icon = ICONS[iconName as keyof typeof ICONS];
  
  if (!Icon) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  return <Icon className={className} />;
}; 