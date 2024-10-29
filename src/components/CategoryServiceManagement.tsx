import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from 'react-hot-toast';
import axios from 'axios';
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
  Trash2,
  Pencil,
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

interface CategoryServiceManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Service {
  id: number;
  name: string;
  icon: string;
  category_id: number;
}

const AVAILABLE_ICONS = [
  { name: 'Server', component: Server },
  { name: 'Database', component: Database },
  { name: 'Cloud', component: Cloud },
  { name: 'Network', component: Network },
  { name: 'Shield', component: Shield },
  { name: 'Settings', component: Settings },
  { name: 'Box', component: Box },
  { name: 'CPU', component: Cpu },
  { name: 'HardDrive', component: HardDrive },
  { name: 'Monitor', component: Monitor },
  { name: 'Router', component: Router },
  { name: 'Lock', component: Lock },
  { name: 'Key', component: Key },
  { name: 'Workflow', component: Workflow },
  { name: 'Terminal', component: Terminal },
  { name: 'Code', component: Code },
  { name: 'FileCode', component: FileCode },
  { name: 'Laptop', component: Laptop },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Wifi', component: Wifi },
  { name: 'Radio', component: Radio },
  { name: 'Cog', component: Cog },
];

const CategoryServiceManagement: React.FC<CategoryServiceManagementProps> = ({
  isOpen,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceIcon, setNewServiceIcon] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.username === 'Admin';

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchServices();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryIcon) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://10.85.0.100:3001/api/categories', {
        name: newCategoryName,
        icon: newCategoryIcon,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      setNewCategoryIcon('');
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddService = async () => {
    if (!newServiceName.trim() || !newServiceIcon || !selectedCategoryId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://10.85.0.100:3001/api/services', {
        name: newServiceName,
        icon: newServiceIcon,
        category_id: selectedCategoryId,
      });
      setServices([...services, response.data]);
      setNewServiceName('');
      setNewServiceIcon('');
      setSelectedCategoryId(null);
      toast.success('Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const IconFound = AVAILABLE_ICONS.find(icon => icon.name === iconName)?.component;
    return IconFound ? <IconFound className="h-4 w-4" /> : null;
  };

  const handleEditCategory = async (category: Category) => {
    try {
      const response = await axios.put(`http://10.85.0.100:3001/api/categories/${category.id}`, {
        name: newCategoryName || category.name,
        icon: newCategoryIcon || category.icon
      });
      setCategories(categories.map(c => c.id === category.id ? response.data : c));
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryIcon('');
      toast.success('Category updated successfully');
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleEditService = async (service: Service) => {
    try {
      const response = await axios.put(`http://10.85.0.100:3001/api/services/${service.id}`, {
        name: newServiceName || service.name,
        icon: newServiceIcon || service.icon,
        category_id: selectedCategoryId || service.category_id
      });
      setServices(services.map(s => s.id === service.id ? response.data : s));
      setEditingService(null);
      setNewServiceName('');
      setNewServiceIcon('');
      setSelectedCategoryId(null);
      toast.success('Service updated successfully');
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error(error.response?.data?.message || 'Failed to update service');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`http://10.85.0.100:3001/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(categories.filter(c => c.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    try {
      await axios.delete(`http://10.85.0.100:3001/api/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Service deleted successfully');
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Categories & Services</DialogTitle>
          <DialogDescription>
            Add or edit categories and services for change tracking.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="categories">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto] gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-icon">Icon</Label>
                  <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select icon">
                        {newCategoryIcon && (
                          <div className="flex items-center gap-2">
                            <IconComponent iconName={newCategoryIcon} />
                            <span>{newCategoryIcon}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((icon) => (
                        <SelectItem key={icon.name} value={icon.name}>
                          <div className="flex items-center gap-2">
                            <icon.component className="h-4 w-4" />
                            <span>{icon.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-semibold mb-2">Existing Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent iconName={category.icon} />
                      <span>{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCategory(category);
                          setNewCategoryName(category.name);
                          setNewCategoryIcon(category.icon);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,1fr,auto] gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input
                    id="service-name"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-category">Category</Label>
                  <Select
                    value={selectedCategoryId?.toString()}
                    onValueChange={(value) => setSelectedCategoryId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center gap-2">
                            <IconComponent iconName={category.icon} />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-icon">Icon</Label>
                  <Select value={newServiceIcon} onValueChange={setNewServiceIcon}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select icon">
                        {newServiceIcon && (
                          <div className="flex items-center gap-2">
                            <IconComponent iconName={newServiceIcon} />
                            <span>{newServiceIcon}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ICONS.map((icon) => (
                        <SelectItem key={icon.name} value={icon.name}>
                          <div className="flex items-center gap-2">
                            <icon.component className="h-4 w-4" />
                            <span>{icon.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddService}>Add Service</Button>
            </div>

            <div className="border rounded-md p-4">
              <h4 className="font-semibold mb-2">Existing Services</h4>
              <div className="space-y-2">
                {services.map((service) => {
                  const category = categories.find(c => c.id === service.category_id);
                  return (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent iconName={service.icon} />
                        <span>{service.name}</span>
                        {category && (
                          <span className="text-sm text-muted-foreground">
                            ({category.name})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingService(service);
                            setNewServiceName(service.name);
                            setNewServiceIcon(service.icon);
                            setSelectedCategoryId(service.category_id);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryServiceManagement; 