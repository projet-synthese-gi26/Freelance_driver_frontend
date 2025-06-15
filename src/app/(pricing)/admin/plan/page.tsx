"use client"
import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { ChevronDown, Download, FileEdit, Plus, Search, Trash2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanFormModal from '@/components/modals/PlanFormModal';
import { toast } from 'react-hot-toast';
import { exportToCSV } from '@/components/utils/CSVutils';
import axios, { AxiosError } from 'axios';
import EmptyJumbotron from '@/components/EmptyJumbotron';
import LoaderOverlay from '@/components/LoaderOverlay';

export interface Plan {
  planId: string;
  category: string;
  description: string[];
  content: string;
  amount: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  user: string;
  changes: Record<string, any>;
}

const PlanManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState("")

  const columnHelper = createColumnHelper<Plan>();

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsAddModalOpen(true);
  };

  const fetchPlans = async () => {
    setLoading(true)
    try {
      await axios.get(process.env.SERVER_URL + '/plans')
        .then((response) => {
          console.log(response.data);
          setPlans(response.data);
        })
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingStatus(axiosError.code || "UNKNOWN_ERROR");
      console.error(axiosError);

    } finally {
      setLoading(false)
    }

  };

  useEffect(() => {
    fetchPlans();
  }, [])

  const handleDelete = async (planId: string) => {
    setConfirmDeleteOpen(true);
    setSelectedPlan(plans.find((plan) => plan.planId === planId));
  };

  const handleConfirmDelete = async (planId: string) => {
    setLoading(true)
    try {
      console.log(selectedPlan);

      await axios.delete(`${process.env.SERVER_URL}/plans/${planId}`);
      setConfirmDeleteOpen(false);
      fetchPlans();
      toast.success('Plan deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingStatus(axiosError.code || "UNKNOWN_ERROR");
      console.error(axiosError);
      toast.error('Error deleting plan');
    } finally {
      setLoading(false)
    }
  };


  const columns = [
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => (
        <div className="max-w-xs">
          <ul className="list-disc list-inside">
            {info.getValue().map((desc, idx) => (
              <li key={idx} className="truncate text-sm">{desc}</li>
            ))}
          </ul>
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => {
        const amount = info.getValue();
        return <span>{typeof amount === 'number' ? amount.toFixed(2) : '0.00'} €</span>;
      },
    }),
    columnHelper.accessor('duration', {
      header: 'Duration (month)',
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <FileEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(info.row.original.planId)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: plans,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      {loading ? (<LoaderOverlay />) : (
        <div>
          <div className="flex justify-between items-center mb-6 pl-2">
            <h2 className="text-xl font-bold text-gray-800">Plan Management</h2>
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button
                onClick={() => {
                  if (plans.length <= 0) return toast.error('No plans to export');
                  exportToCSV({ data: plans, filename: 'plans' })
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} />
                <span>Export</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-900"
              >
                <Plus size={20} />
                <span>New Plan</span>
              </button>
            </div>
          </div>
          {plans.length === 0 ? (<EmptyJumbotron code={loadingStatus} />) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto ml-0 sm:ml-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center space-x-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              {header.column.getCanSort() && (
                                <ChevronDown size={16} className="text-gray-400" />
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Page{' '}
                    <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> on{' '}
                    <span className="font-medium">{table.getPageCount()}</span>
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isAddModalOpen && (
          <PlanFormModal
            plan={selectedPlan}
            onClose={() => {
              setIsAddModalOpen(false);
              setSelectedPlan(undefined);
            }}
            onSubmit={(plan) => {
              setIsAddModalOpen(false);
              setSelectedPlan(undefined);
            }}
            fetchPlans={fetchPlans}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {
          isConfirmDeleteOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-lg"
              >
                <div>
                  <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                  <p className="text-gray-600 mb-4">Are you sure you want to delete this plan?</p>
                  <div className="flex items-center justify-end">
                    <button className='p-4 mx-4 bg-blue-500 text-white rounded' onClick={() => {
                      console.log(selectedPlan);

                      if (selectedPlan) {
                        handleConfirmDelete(selectedPlan.planId)
                      }
                    }}>Yes</button>
                    <button className='p-4 bg-red-500 text-white rounded' onClick={() => setConfirmDeleteOpen(false)}>No</button>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
};



export default PlanManagement;