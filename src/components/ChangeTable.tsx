import React from 'react';
import { DataTable } from '@shadcn/ui';

interface Change {
  id: number;
  description: string;
  date: string;
}

interface ChangeTableProps {
  changes: Change[];
}

const ChangeTable: React.FC<ChangeTableProps> = ({ changes }) => {
  const columns = [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Date',
      accessor: 'date',
    },
  ];

  return <DataTable columns={columns} data={changes} />;
};

export default ChangeTable;
