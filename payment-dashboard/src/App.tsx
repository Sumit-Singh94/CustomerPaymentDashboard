import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { fetchCustomers, saveCustomer, deleteCustomers } from "./lib/api";
import { useStore } from "./store/store";
import type { Status } from "./lib/types";
import CustomerForm from "./components/ui/customerform";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Badge } from "./components/ui/badge";
import { Checkbox } from "./components/ui/checkbox";
import { Trash2, Plus, Edit2 } from "lucide-react";

const queryClient = new QueryClient();

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedIds, toggleSelection, selectAll, clearSelection } =
    useStore();

  // Queries
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  // Mutations
  const client = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: saveCustomer,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["customers"] });
      setIsModalOpen(false);
      clearSelection();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomers,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["customers"] });
      clearSelection();
    },
  });

  // Helpers
  const handleEdit = () => setIsModalOpen(true);
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete these records?")) {
      deleteMutation.mutate(selectedIds);
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "Due":
        return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
      case "Open":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedIds[0]);
  const isAllSelected =
    customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payment Dashboard
            </h1>
            <p className="text-slate-500">
              Manage customer payments and status.
            </p>
          </div>

          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedIds.length}
                )
              </Button>
            )}

            {selectedIds.length === 1 ? (
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="mr-2 h-4 w-4" /> Update Customer
              </Button>
            ) : (
              <Button
                onClick={() => {
                  clearSelection();
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Customer
              </Button>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      checked
                        ? selectAll(customers.map((c) => c.id))
                        : clearSelection()
                    }
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="max-w-[150px]">Description</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Deposit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-slate-500"
                  >
                    No Data Found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    data-state={selectedIds.includes(customer.id) && "selected"}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(customer.id)}
                        onCheckedChange={() => toggleSelection(customer.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {customer.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`font-normal border ${getStatusColor(customer.status)}`}
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="max-w-[120px] sm:max-w-[200px] truncate text-slate-500"
                      title={customer.description}
                    >
                      {customer.description}
                    </TableCell>{" "}
                    <TableCell className="text-right font-mono">
                      ${customer.rate.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-500">
                      ${customer.deposit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${customer.balance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CustomerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => saveMutation.mutate(data)}
        initialData={selectedIds.length === 1 ? selectedCustomer : null}
        isLoading={saveMutation.isPending}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
