import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './components/SignIn';
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  ColumnDef,
  SortingState,
  RowSelectionState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Change } from './types/change';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import AddChangeDialog from './components/AddChangeDialog';
import EditChangeDialog from './components/EditChangeDialog';
import ViewChangeDialog from './components/ViewChangeDialog';
import CategoryFilter from './components/CategoryFilter';
import ServiceFilter from './components/ServiceFilter';
import DateTimeFilter from './components/DateTimeFilter';
import { UserAvatar } from './components/UserAvatar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/signin" />;
};

// Move your existing App content to MainApp component
const MainApp: React.FC = () => {
  const [changes, setChanges] = useState<Change[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [users, setUsers] = useState<Array<{ id: number; username: string }>>([]);
  const [selectedChange, setSelectedChange] = useState<Change | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { logout } = useAuth();

  // Add error interceptor for axios
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error('Authentication expired. Please login again.');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchChanges();
  }, []);

  const fetchChanges = async () => {
    try {
      const response = await axios.get('http://10.85.0.100:3001/api/changes');
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  const addChange = async (changeData: FormData) => {
    try {
      const response = await axios.post('http://10.85.0.100:3001/api/changes', changeData);
      setChanges([response.data, ...changes]);
      toast.success('Change added successfully');
    } catch (error) {
      console.error('Error adding change:', error);
      toast.error('Failed to add change');
    }
  };

  const editChange = async (id: number, updatedChange: FormData) => {
    try {
      const response = await axios.put(`http://10.85.0.100:3001/api/changes/${id}`, updatedChange);
      setChanges(changes.map(change => change.id === id ? response.data : change));
      toast.success('Change updated successfully');
    } catch (error) {
      console.error('Error updating change:', error);
      toast.error('Failed to update change');
    }
  };

  const deleteChange = async (id: number) => {
    try {
      await axios.delete(`http://10.85.0.100:3001/api/changes/${id}`);
      setChanges(changes.filter(change => change.id !== id));
      toast.success('Change deleted successfully');
    } catch (error) {
      console.error('Error deleting change:', error);
      toast.error('Failed to delete change');
    }
  };

  const resetFilters = () => {
    setGlobalFilter('');
    setCategoryFilter('all');
    setServiceFilter('all');
    setDateFilter(null);
  };

  const columns: ColumnDef<Change>[] = [
    // ... your column definitions
  ];

  const filteredChanges = useMemo(() => {
    return changes.filter(change => {
      const matchesCategory = categoryFilter === 'all' || change.category === categoryFilter;
      const matchesService = serviceFilter === 'all' || change.service === serviceFilter;
      const user = users.find(u => u.id === change.user_id);
      const matchesGlobalFilter = 
        change.change_details.toLowerCase().includes(globalFilter.toLowerCase()) ||
        change.category.toLowerCase().includes(globalFilter.toLowerCase()) ||
        change.service.toLowerCase().includes(globalFilter.toLowerCase()) ||
        (user ? user.username.toLowerCase().includes(globalFilter.toLowerCase()) : false);
      
      const matchesDate = !dateFilter || 
        new Date(change.date).getTime() >= new Date(dateFilter).setHours(0, 0, 0, 0) &&
        new Date(change.date).getTime() < new Date(dateFilter).setHours(23, 59, 59, 999);

      return matchesCategory && matchesService && matchesGlobalFilter && matchesDate;
    });
  }, [changes, categoryFilter, serviceFilter, globalFilter, users, dateFilter]);

  const table = useReactTable({
    data: filteredChanges,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  const uniqueCategories = useMemo(() => {
    const categories = new Set(changes.map(change => change.category));
    return Array.from(categories).filter(category => category !== '');
  }, [changes]);

  const uniqueServices = useMemo(() => {
    const services = new Set(changes.map(change => change.service));
    return Array.from(services).filter(service => service !== '');
  }, [changes]);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar onUserAdded={fetchUsers} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search all columns..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />
              <CategoryFilter
                categories={uniqueCategories}
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
              <ServiceFilter
                services={uniqueServices}
                value={serviceFilter}
                onChange={setServiceFilter}
              />
              <DateTimeFilter
                value={dateFilter}
                onChange={setDateFilter}
                onClear={() => setDateFilter(null)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={resetFilters}
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Change</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      <AddChangeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddChange={addChange}
      />

      {selectedChange && (
        <>
          <EditChangeDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onEditChange={editChange}
            change={selectedChange}
          />

          <ViewChangeDialog
            isOpen={isViewDialogOpen}
            onClose={() => setIsViewDialogOpen(false)}
            change={selectedChange}
          />
        </>
      )}
    </SidebarProvider>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
