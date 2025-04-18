import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Clock, Search, AlertCircle } from 'lucide-react';

type ComplaintStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

interface Complaint {
  id: string;
  subject: string;
  submittedBy: string;
  date: string;
  status: ComplaintStatus;
  department: string;
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    subject: 'Harassment in Library',
    submittedBy: 'John Doe',
    date: '2024-03-15',
    status: 'pending',
    department: 'Computer Science'
  },
  {
    id: '2',
    subject: 'Verbal Abuse',
    submittedBy: 'Jane Smith',
    date: '2024-03-14',
    status: 'investigating',
    department: 'Electronics'
  },
  {
    id: '3',
    subject: 'Physical Intimidation',
    submittedBy: 'Mike Johnson',
    date: '2024-03-13',
    status: 'resolved',
    department: 'Mechanical'
  }
];

const columnHelper = createColumnHelper<Complaint>();

export function AdminDashboard() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('subject', {
      header: 'Subject',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('submittedBy', {
      header: 'Submitted By',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('date', {
      header: ({ column }) => {
        return (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        );
      },
      cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const getStatusDisplay = () => {
          switch (status) {
            case 'pending':
              return (
                <span className="flex items-center text-yellow-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending
                </span>
              );
            case 'investigating':
              <span className="flex items-center text-blue-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                Investigating
              </span>
            case 'resolved':
              return (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Resolved
                </span>
              );
            default:
              return status;
          }
        };
        return (
          <div className="flex items-center space-x-2">
            {getStatusDisplay()}
            <select
              className="ml-2 text-sm border rounded-md"
              value={status}
              onChange={(e) => {
                // This would typically update the status in your backend
                console.log(`Updating status for ${info.row.original.id} to ${e.target.value}`);
              }}
            >
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: mockComplaints.filter(complaint => 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.department.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Complaints Management</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}