import React, { useState, useEffect } from 'react';
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
  useReactTable,
} from "@tanstack/react-table";
import AddChangeDialog from './components/AddChangeDialog';
import RowActions from './components/RowActions';
import { Change } from './types/change';
import { Button } from "./components/ui/button";

const App: React.FC = () => {
  const [changes, setChanges] = useState<Change[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchChanges();
  }, []);

  const fetchChanges = async () => {
    try {
      const response = await axios.get('http://10.85.0.100/api/changes');
      setChanges(response.data);
    } catch (error) {
      console.error('Error fetching changes:', error);
    }
  };

  const addChange = async (changeData: Omit<Change, 'id'>) => {
    try {
      const response = await axios.post('http://10.85.0.100/api/changes', changeData);
      setChanges([response.data, ...changes]);
    } catch (error) {
      console.error('Error adding change:', error);
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

  const editChange = async (id: number, updatedChange: Omit<Change, 'id'>) => {
    try {
      const response = await axios.put(`http://10.85.0.100/api/changes/${id}`, updatedChange);
      setChanges(changes.map(change => change.id === id ? response.data : change));
    } catch (error) {
      console.error('Error editing change:', error);
    }
  };

  const columns: ColumnDef<Change>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "change_details",
      header: "Change Details",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "date",
      header: "Date",
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
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Change Tracker</h1>
      <div className="mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Change</Button>
        <AddChangeDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddChange={addChange}
        />
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
    </div>
  );
};

export default App;
