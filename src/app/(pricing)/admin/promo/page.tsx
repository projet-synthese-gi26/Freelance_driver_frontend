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
import {
  ChevronDown, Download, FileEdit, Plus, Search,
  Trash2, Calendar, Filter, Copy, CheckCircle, XCircle, Circle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { PromoFormModal } from '@/components/modals/PromoFormModal';
import { FilterModal } from '@/components/modals/FilterModalPromo';
import axios, { AxiosError } from 'axios';
import LoaderOverlay from '@/components/LoaderOverlay';
import EmptyJumbotron from '@/components/EmptyJumbotron';

interface PromoCode {
  id: string;
  code: string;
  validity: number;
  discount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED' | 'USED';
  startDate: string;
  usageCount?: number;
  maxUsage?: number;
}

interface FilterState {
  status: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  discountRange: {
    min: number | null;
    max: number | null;
  };
}

const Page = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: { start: null, end: null },
    discountRange: { min: null, max: null },
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper<PromoCode>();
  const [action, setActions] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState("")

  const fetchPromoCodes = async () => {
    setLoading(true)
    try {
      await axios.get(process.env.SERVER_URL + '/promocodes')
        .then((response) => {
          console.log(response.data);

          setPromoCodes(response.data);
        })
    } catch (error) {

      const axiosError = error as AxiosError;
      setLoadingStatus(axiosError.code || "UNKNOWN_ERROR");
      console.error(axiosError);

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes();
  }, [])
  const handleEdit = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setIsAddModalOpen(true);
  };

  const handleStatusToggle = async (promo: PromoCode) => {
    setActions(true)
    try {
      await fetch(process.env.SERVER_URL + `/promocodes/disable/` + promo.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promo),
      });
      setPromoCodes((prev) => prev.map((p) => (p.id === promo.id ? { ...p, status: p.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : p)));
      fetchPromoCodes();
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingStatus(axiosError.code || "UNKNOWN_ERROR");
      console.error(axiosError); 
      console.error('Error updating promo code status:', error);
    } finally {
      setActions(false)
    }
  };

  const handleActiveToggle = async (promo: PromoCode) => {
    setActions(true)
    try {
      await fetch(process.env.SERVER_URL + `/promocodes/active/` + promo.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promo),
      });
      fetchPromoCodes();
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoadingStatus(axiosError.code || "UNKNOWN_ERROR");
      console.error(axiosError);
      console.error('Error updating promo code status:', error);
    } finally {
      setActions(false)
    }
  };

  const columns = [
    columnHelper.accessor('code', {
      header: 'Promo code',
      cell: (info) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono font-medium">{info.getValue()}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(info.getValue());
              toast.success('Promo code copied to clipboard');
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Copy size={14} />
          </button>
        </div>
      ),
    }),
    columnHelper.accessor('discount', {
      header: 'Discount (%)',
      cell: (info) => <span>{info.getValue()}%</span>,
    }),
    columnHelper.accessor('validity', {
      header: 'Validity (days)',
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => (
        <span>
          {format(new Date(info.getValue()), 'dd MMM yyyy', { locale: enUS })}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
            ${status === 'EXPIRED' ? 'bg-red-100 text-red-800' : ''}
            ${status === 'DISABLED' ? 'bg-gray-100 text-gray-800' : ''}
            ${status === 'USED' ? 'bg-blue-100 text-blue-800' : ''}
          `}>
            {status === 'ACTIVE' ? 'ACTIVE' : status === 'EXPIRED' ? 'EXPIRED' : status === 'DISABLED' ? 'DISABLED' : 'USED'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          {action ? (<div className="custom_loader_ring" />) : (
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <FileEdit size={18} />
            </button>
          )}

          {info.row.original.status === 'ACTIVE' && (
            <div>
              {action ? (<div className="custom_loader_ring" />) : (
                <button
                  onClick={() => handleStatusToggle(info.row.original)}

                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <XCircle size={18} />
                </button>
              )}
            </div>
          )}
          {info.row.original.status === 'DISABLED' && (
            <div>
              {action ? (<div className="custom_loader_ring" />) : (
                <button
                  onClick={() => handleActiveToggle(info.row.original)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <CheckCircle size={18} />
                </button>
              )}
            </div>

          )}
          {info.row.original.status === 'EXPIRED' && (
            <div>
              {action ? (<div className="custom_loader_ring" />) : (
                <button
                  onClick={() => handleStatusToggle(info.row.original)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <CheckCircle size={18} />
                </button>
              )}
            </div>

          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: promoCodes,
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

  const exportToCSV = () => {
    const headers = ['Code', 'Discount', 'Validity', 'Start date', 'Status', 'Usage'];
    const csvData = promoCodes.map(promo => [
      promo.code,
      `${promo.discount}%`,
      promo.validity,
      format(new Date(promo.startDate), 'dd/MM/yyyy'),
      promo.status,
      `${promo.usageCount}/${promo.maxUsage || '∞'}`
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes-promo-${format(new Date(), 'dd-MM-yyyy')}.csv`;
    a.click();
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      {loading ? (<LoaderOverlay />) : (
        <div>
          <div className="flex justify-between items-center mb-6 pl-6">
            <h2 className="text-2xl font-bold text-gray-800">Promo code</h2>
            <div className="flex flex-wrap gap-2 sm:gap-4">
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
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} />
                <span>Filter</span>
              </button>
              <button
                onClick={exportToCSV}
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
                <span>New Code</span>
              </button>
            </div>
          </div>

          {promoCodes.length === 0 ? (<EmptyJumbotron code={loadingStatus} />) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:ml-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm text-gray-500">Actives Codes</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {promoCodes.filter(p => p.status === 'ACTIVE').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm text-gray-500">Average discount</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(promoCodes.reduce((acc, p) => acc + p.discount, 0) / promoCodes.length)}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm text-gray-500">Expired Codes</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {promoCodes.filter(p => p.status === 'EXPIRED').length}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-x-auto sm:ml-6">
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

                <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-gray-700">
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
            </div>
          )}

        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <PromoFormModal
            promo={selectedPromo}
            onClose={() => {
              setIsAddModalOpen(false);
              setSelectedPromo(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFilterModalOpen && (
          <FilterModal
            filters={filters}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={(newFilters) => {
              setFilters(newFilters);
              setIsFilterModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;