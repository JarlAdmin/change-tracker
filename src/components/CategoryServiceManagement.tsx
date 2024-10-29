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
import { useToast } from "@/components/ui/use-toast";
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
  Users,
  Mail,
  MessageSquare,
  Building2,
  FolderTree,
  Share2,
  Globe,
  ShieldCheck,
  Layers,
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
  { name: 'Users', component: Users },
  { name: 'Mail', component: Mail },
  { name: 'MessageSquare', component: MessageSquare },
  { name: 'Building2', component: Building2 },
  { name: 'FolderTree', component: FolderTree },
  { name: 'Share2', component: Share2 },
  { name: 'Globe', component: Globe },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Layers', component: Layers },
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

  // Add edit mode states
  const [editMode, setEditMode] = useState<'category' | 'service' | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const { toast } = useToast();

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch categories",
      });
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch services",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryIcon) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
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
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category",
      });
    }
  };

  const handleAddService = async () => {
    if (!newServiceName.trim() || !newServiceIcon || !selectedCategoryId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
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
      toast({
        title: "Success",
        description: "Service added successfully",
      });
    } catch (error) {
      console.error('Error adding service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add service",
      });
    }
  };

  const IconComponent = ({ iconName }: { iconName: string }) => {
    const IconFound = AVAILABLE_ICONS.find(icon => icon.name === iconName)?.component;
    return IconFound ? <IconFound className="h-4 w-4" /> : null;
  };

  const handleEditCategory = async (categoryId: number) => {
    try {
      if (!newCategoryName.trim() || !newCategoryIcon) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      const response = await axios.put(
        `http://10.85.0.100:3001/api/categories/${categoryId}`,
        {
          name: newCategoryName,
          icon: newCategoryIcon
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setCategories(categories.map(c => c.id === categoryId ? response.data : c));
      setEditMode(null);
      setEditId(null);
      setNewCategoryName('');
      setNewCategoryIcon('');
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || 'Failed to update category',
      });
    }
  };

  const handleEditService = async (serviceId: number) => {
    try {
      if (!newServiceName.trim() || !newServiceIcon || !selectedCategoryId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      const response = await axios.put(
        `http://10.85.0.100:3001/api/services/${serviceId}`,
        {
          name: newServiceName,
          icon: newServiceIcon,
          category_id: selectedCategoryId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setServices(services.map(s => s.id === serviceId ? response.data : s));
      setEditMode(null);
      setEditId(null);
      setNewServiceName('');
      setNewServiceIcon('');
      setSelectedCategoryId(null);
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || 'Failed to update service',
      });
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
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || 'Failed to delete category',
      });
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
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || 'Failed to delete service',
      });
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
                    {editMode === 'category' && editId === category.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="flex-1"
                        />
                        <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select icon" />
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditMode(null);
                            setEditId(null);
                            setNewCategoryName('');
                            setNewCategoryIcon('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <IconComponent iconName={category.icon} />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditMode('category');
                              setEditId(category.id);
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
                      </>
                    )}
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
                      {editMode === 'service' && editId === service.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            placeholder="Service name"
                            className="flex-1"
                          />
                          <Select
                            value={selectedCategoryId?.toString()}
                            onValueChange={(value) => setSelectedCategoryId(Number(value))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent iconName={cat.icon} />
                                    <span>{cat.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={newServiceIcon} onValueChange={setNewServiceIcon}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select icon" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditService(service.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditMode(null);
                              setEditId(null);
                              setNewServiceName('');
                              setNewServiceIcon('');
                              setSelectedCategoryId(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
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
                                setEditMode('service');
                                setEditId(service.id);
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
                        </>
                      )}
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