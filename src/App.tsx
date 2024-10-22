import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import AddChangeDialog from './components/AddChangeDialog';
import RowActions from './components/RowActions';
import { Change } from './types/change';
import { Button } from "./components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import CategoryFilter from './components/CategoryFilter';
import ServiceFilter from './components/ServiceFilter';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'http://10.85.0.100:3001';

const App: React.FC = () => {
  const [changes, setChanges] = useState<Change[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');

  useEffect(() => {
    fetchChanges();
  }, []);

  const fetchChanges = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/changes`);
      console.log('Full API response:', response);
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  const addChange = async (changeData: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/changes`, changeData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setChanges([response.data, ...changes]);
    } catch (error) {
      console.error('Error adding change:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
      // Log the entire error object
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }
  };

  const deleteChange = async (id: number) => {
    try {
      await axios.delete(`http://10.85.0.100/api/changes/${id}`);
      setChanges(changes.filter(change => change.id !== id));
    } catch (error) {
      console.error('Error deleting change:', error);
    }
  };

  const editChange = async (id: number, updatedChange: FormData) => {
    try {
      console.log('Sending edit request:', { id, ...Object.fromEntries(updatedChange) });
      const response = await axios.put(`${API_BASE_URL}/api/changes/${id}`, updatedChange, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Received response:', response.data);
      setChanges(changes.map(change => change.id === id ? response.data : change));
      toast.success('Change updated successfully');
    } catch (error) {
      console.error('Error editing change:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
        toast.error(`Error updating change: ${error.response.data.error}`);
      } else {
        toast.error('An unexpected error occurred while updating the change');
      }
    }
  };

  const columns: ColumnDef<Change>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
    },
    {
      accessorKey: "username",
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
      cell: ({ row }) => <RowActions change={row.original} onDelete={deleteChange} onEdit={editChange} />,
    },
  ];

  const table = useReactTable({
    data: changes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnFilters: [
        { id: 'category', value: categoryFilter },
        { id: 'service', value: serviceFilter },
      ],
    },
    filterFns: {
      categoryFilter: (row, columnId, filterValue: string) => {
        if (filterValue === '' || filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
      },
      serviceFilter: (row, columnId, filterValue: string) => {
        if (filterValue === '' || filterValue === 'all') return true;
        return row.getValue(columnId) === filterValue;
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Change Tracker</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <CategoryFilter
            categories={uniqueCategories}
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value);
              table.getColumn('category')?.setFilterValue(value);
            }}
          />
          <ServiceFilter
            services={uniqueServices}
            value={serviceFilter}
            onChange={(value) => {
              setServiceFilter(value);
              table.getColumn('service')?.setFilterValue(value);
            }}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Change</Button>
      </div>
      <AddChangeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddChange={addChange}
      />
      <div className="flex-1 text-sm text-muted-foreground mb-2">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default App;
