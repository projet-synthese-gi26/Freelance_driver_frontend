"use client";
import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  ChevronDown, Download, Search, Filter, Eye,
  TrendingUp, Users, CreditCard, CheckCircle, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { SubscriptionDetailModal } from '@/components/modals/SubscriptionDetailModal';
import { FilterModal } from '@/components/modals/FilterModalSubscription';
import { exportToCSV } from '../../../../components/utils/CSVutils';
import { toast } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import EmptyJumbotron from '@/components/EmptyJumbotron';
import LoaderOverlay from '@/components/LoaderOverlay';


interface Subscription {
  subscriptionId: string;
  paymentDate: string;
  updateDate: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  paymentMethodId: string;
  userId: string;
  userName: string;
  planName: string;
  amount: number;
  renewalDate: string;
}

interface FilterState {
  status: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  planId: string[];
  paymentMethod: string[];
}

const Page = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    // {
    //   subscriptionId: "sub_001",
    //   paymentDate: "2025-03-01",
    //   updateDate: "2025-03-10",
    //   planId: "plan_101",
    //   status: "active",
    //   paymentMethodId: "pm_001",
    //   userId: "user_001",
    //   userName: "Alice Dupont",
    //   planName: "Premium",
    //   amount: 29.99,
    //   renewalDate: "2025-04-01"
    // },
    // {
    //   subscriptionId: "sub_002",
    //   paymentDate: "2025-03-05",
    //   updateDate: "2025-03-12",
    //   planId: "plan_102",
    //   status: "expired",
    //   paymentMethodId: "pm_002",
    //   userId: "user_002",
    //   userName: "Bob Martin",
    //   planName: "Standard",
    //   amount: 19.99,
    //   renewalDate: "2025-04-05"
    // },
    // {
    //   subscriptionId: "sub_003",
    //   paymentDate: "2025-02-15",
    //   updateDate: "2025-03-15",
    //   planId: "plan_103",
    //   status: "expired",
    //   paymentMethodId: "pm_003",
    //   userId: "user_003",
    //   userName: "Charlie Durand",
    //   planName: "Basic",
    //   amount: 9.99,
    //   renewalDate: "2025-03-15"
    // },
    // {
    //   subscriptionId: "sub_004",
    //   paymentDate: "2025-03-10",
    //   updateDate: "2025-03-20",
    //   planId: "plan_104",
    //   status: "cancelled",
    //   paymentMethodId: "pm_004",
    //   userId: "user_004",
    //   userName: "Diane Morel",
    //   planName: "Enterprise",
    //   amount: 49.99,
    //   renewalDate: "2025-04-10"
    // },
    // {
    //   subscriptionId: "sub_005",
    //   paymentDate: "2025-03-08",
    //   updateDate: "2025-03-18",
    //   planId: "plan_105",
    //   status: "active",
    //   paymentMethodId: "pm_005",
    //   userId: "user_005",
    //   userName: "Ethan Lefebvre",
    //   planName: "Pro",
    //   amount: 39.99,
    //   renewalDate: "2025-04-08"
    // }
  ]
  );
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: { start: null, end: null },
    planId: [],
    paymentMethod: [],
  });

  const columnHelper = createColumnHelper<Subscription>();

  const columns = [
    columnHelper.accessor('userName', {
      header: 'User',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('planName', {
      header: 'Plan',
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => {
        const amount = info.getValue();
        return <span>{typeof amount === 'number' ? amount.toFixed(2) : '0.00'} €</span>;
      },
    }),
    columnHelper.accessor('paymentDate', {
      header: 'Payment Date',
      cell: (info) => (
        <span>{format(new Date(info.getValue()), 'dd MMM yyyy', { locale: enUS })}</span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        const statusStyles = {
          active: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800',
          expired: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800',
        };
        const statusLabels = {
          active: 'Active',
          cancelled: 'Cancelled',
          expired: 'Expired',
          pending: 'Pending',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
            {statusLabels[status]}
          </span>
        );
      },
    }),
    columnHelper.accessor('renewalDate', {
      header: 'Renewal Date',
      cell: (info) => (
        <span>{format(new Date(info.getValue()), 'dd MMM yyyy', { locale: enUS })}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <button
          onClick={() => {
            setSelectedSubscription(info.row.original);
            setIsDetailModalOpen(true);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Eye size={18} />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: subscriptions,
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

  // Données simulées pour les graphiques
  const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 3600 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 5200 },
    { month: 'May', revenue: 6800 },
    { month: 'Jun', revenue: 7900 },
  ];

  const subscriptionTrends = [
    { month: 'Jan', actives: 120, new: 30, cancelled: 10 },
    { month: 'Feb', actives: 140, new: 35, cancelled: 15 },
    { month: 'Mar', actives: 160, new: 40, cancelled: 20 },
    { month: 'Apr', actives: 180, new: 45, cancelled: 25 },
    { month: 'May', actives: 200, new: 50, cancelled: 30 },
    { month: 'Jun', actives: 220, new: 55, cancelled: 35 },
  ];

  const fetchSubscription = async () => {
    setLoading(true)
    try {
      await axios.get(process.env.SERVER_URL + '/subscriptions')
        .then((response) => {
          console.log(response.data);
          setSubscriptions(response.data);
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
    fetchSubscription();
  }, [])

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6">
      {loading ? (<LoaderOverlay />) : (
        <div>
          <div className="flex justify-between items-center mb-6 pl-6">
            <h2 className="text-2xl font-bold text-gray-800">Subscriptions history</h2>
            <div className="flex space-x-4">
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
                <span>Filters</span>
              </button>
              <button
                onClick={() => {
                  if (subscriptions.length <= 0) return toast.error('No plans to export');
                  exportToCSV({ data: subscriptions, filename: 'subscriptions' })
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={20} />
                <span>Export</span>
              </button>
            </div>
          </div>
          {subscriptions.length === 0 ? (<EmptyJumbotron code={loadingStatus} />) : (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6 ml-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Actives Subscriptions</p>
                      <p className="text-2xl font-bold text-green-600">230</p>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Users className="text-green-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="text-green-500 mr-1" size={16} />
                    <span className="text-green-500">+5.2%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income</p>
                      <p className="text-2xl font-bold text-blue-600">4,250 xaf</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <CreditCard className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="text-green-500 mr-1" size={16} />
                    <span className="text-green-500">+8.1%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Average Duration</p>
                      <p className="text-2xl font-bold text-orange-600">8.5 months</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                      <Calendar className="text-orange-600" size={24} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="text-green-500 mr-1" size={16} />
                    <span className="text-green-500">+0.8%</span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6 ml-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Monthly Incomes</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#0066FF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Subscription Trends</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={subscriptionTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="actives" stroke="#0066FF" />
                        <Line type="monotone" dataKey="new" stroke="#00CC88" />
                        <Line type="monotone" dataKey="cancelled" stroke="#FF4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden ml-6 ">
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


                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
            </div>
          )}


        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isDetailModalOpen && selectedSubscription && (
          <SubscriptionDetailModal
            subscription={selectedSubscription}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedSubscription(null);
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