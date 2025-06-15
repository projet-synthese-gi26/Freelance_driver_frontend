import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

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
export const FilterModal: React.FC<{
    filters: FilterState;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
  }> = ({ filters, onClose, onApply }) => {
    const [localFilters, setLocalFilters] = useState(filters);
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-lg w-full max-w-xl p-6 m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
  
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Status</h3>
              <div className="flex flex-wrap gap-2">
                {['active', 'expired', 'disabled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setLocalFilters(prev => ({
                        ...prev,
                        status: prev.status.includes(status)
                          ? prev.status.filter(s => s !== status)
                          : [...prev.status, status]
                      }));
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      localFilters.status.includes(status)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
  
            <div>
              <h3 className="font-medium mb-3">Date Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={localFilters.dateRange.start || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: e.target.value }
                  }))}
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  type="date"
                  value={localFilters.dateRange.end || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: e.target.value }
                  }))}
                  className="border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Discount Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={localFilters.discountRange.min || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    discountRange: { ...prev.discountRange, min: parseInt(e.target.value) }
                  }))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="min"
                />
                <input
                  type="number"
                  value={localFilters.discountRange.max || ''}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    discountRange: { ...prev.discountRange, max: parseInt(e.target.value) }
                  }))}
                  className="border rounded-lg px-3 py-2"
                  placeholder="max"
                />
              </div>
            </div>
          </div>
  
          <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
            <button
              onClick={() => {
                setLocalFilters({
                  status: [],
                  dateRange: { start: null, end: null },
                  discountRange: {min:null, max:null},
                });
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Reset
            </button>
            <button
              onClick={() => onApply(localFilters)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-900"
            >
              Apply
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };