import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  Search,
  AlertCircle,
} from "lucide-react";

type ComplaintStatus = "pending" | "investigating" | "resolved" | "dismissed";

interface Complaint {
  _id: string;
  subject: string;
  description: string;
  date: string;
  location: string;
  witnesses: string;
  name: string;
  department: string;
  user_id: string;
  filePath: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}

const columnHelper = createColumnHelper<Complaint>();

export function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/complaints/complaint`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched complaints:", data);
          setComplaints(data || []);
        } else {
          console.error("Failed to fetch complaints");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("department", {
      header: "Department",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("subject", {
      header: "Subject",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <div className="max-w-xs truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("date", {
      header: ({ column }) => (
        <button
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      cell: (info) => format(new Date(info.getValue()), "MMM d, yyyy"),
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("witnesses", {
      header: "Witnesses",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("filePath", {
      header: "File Path",
      cell: (info) => {
        const path = info.getValue();
        return path ? <span className="text-gray-700">{path}</span> : "No File";
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const complaintId = info.row.original._id;

        const getStatusDisplay = () => {
          switch (status) {
            case "pending":
              return (
                <span className="flex items-center text-yellow-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending
                </span>
              );
            case "investigating":
              return (
                <span className="flex items-center text-blue-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Investigating
                </span>
              );
            case "resolved":
              return (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Resolved
                </span>
              );
            case "dismissed":
              return (
                <span className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Dismissed
                </span>
              );
            default:
              return status;
          }
        };

        const handleStatusChange = async (newStatus: ComplaintStatus) => {
          try {
            const response = await fetch(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/complaints/update-status/${complaintId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus }),
              }
            );

            if (response.ok) {
              console.log(`Status updated to ${newStatus}`);
              setComplaints((prev) =>
                prev.map((comp) =>
                  comp._id === complaintId
                    ? { ...comp, status: newStatus }
                    : comp
                )
              );
            } else {
              console.error("Failed to update status");
            }
          } catch (error) {
            console.error("Error updating status:", error);
          }
        };

        return (
          <div className="flex items-center space-x-2">
            {getStatusDisplay()}
            <select
              id={`status-${complaintId}`}
              name="status"
              className="ml-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 cursor-pointer"
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as ComplaintStatus)
              }
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
    data: filteredComplaints,
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
            <h1 className="text-2xl font-bold text-gray-900">
              Complaints Management
            </h1>
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
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
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
