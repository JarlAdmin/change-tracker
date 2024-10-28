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
import { Checkbox } from "./components/ui/checkbox";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { CategoryWithIcon, ServiceWithIcon } from './components/ServiceIcon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,  // Changed from DoubleArrowLeft
  ChevronsRight, // Changed from DoubleArrowRight
} from "lucide-react";

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
      console.log('Changes response:', response.data);
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
      } else {
        toast.error('Failed to fetch changes');
      }
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
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked: boolean) => table.toggleAllPageRowsSelected(!!checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked: boolean) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "change_details",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Change Details
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const details = row.getValue("change_details") as string;
        const lines = details.split('\n');
        const shouldTruncate = lines.length > 4 || details.length > 200;
        
        const displayText = shouldTruncate
          ? lines.slice(0, 4).join('\n').substring(0, 200)
          : details;

        return (
          <div className="max-w-[500px]">
            <span className="whitespace-pre-wrap">{displayText}</span>
            {shouldTruncate && (
              <>
                ...{' '}
                <button
                  onClick={() => {
                    setSelectedChange(row.original);
                    setIsViewDialogOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Read more
                </button>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <CategoryWithIcon category={row.getValue("category")} />
      ),
    },
    {
      accessorKey: "service",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <ServiceWithIcon 
          category={row.getValue("category")} 
          service={row.getValue("service")} 
        />
      ),
    },
    {
      accessorKey: "user_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const userId = row.getValue("user_id") as number;
        const user = users.find(u => u.id === userId);
        return (
          <div className="flex items-center gap-2">
            {user && <UserAvatar username={user.username} />}
            <span>{user ? user.username : 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const change = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedChange(change);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedChange(change);
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteChange(change.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
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
    // Add pagination configuration
    initialState: {
      pagination: {
        pageSize: 10, // Show 10 items per page
      },
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
      <div className="flex h-screen overflow-hidden"> {/* Added overflow-hidden */}
        <AppSidebar onUserAdded={fetchUsers} />
        <main className="flex-1 flex flex-col min-h-0"> {/* Updated main container */}
          <div className="p-4 flex-shrink-0"> {/* Fixed header section */}
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
          </div>

          <div className="flex-1 min-h-0 p-4 pt-0"> {/* Scrollable content area */}
            <div className="h-full flex flex-col rounded-md border">
              <div className="flex-1 overflow-auto"> {/* Scrollable table container */}
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10"> {/* Sticky header */}
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

            {/* Pagination section */}
            <div className="border-t bg-background">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value));
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

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
      </div>
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
