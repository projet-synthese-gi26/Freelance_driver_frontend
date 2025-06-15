import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

interface Plan {
  planId: string;
  category: string;
  description: string[];
  content: string;
  amount: number;
  duration: number;
}

interface PlanFormModalProps {
  plan?: Plan | null;
  onClose: () => void;
  onSubmit: (plan: Partial<Plan>) => void;
  fetchPlans: () => Promise<void>;
}

interface FormData {
  category: string;
  description: string[];
  content: string;
  amount: string;
  duration: string;
}

const PlanFormModal: React.FC<PlanFormModalProps> = ({ plan, onClose, fetchPlans }) => {
  const [formData, setFormData] = useState<FormData>({
    category: plan?.category || '',
    description: plan?.description || [''],
    content: plan?.content || '',
    amount: plan?.amount?.toString() || '',
    duration: plan?.duration?.toString() || ''
  });

  const handleDescriptionChange = (index: number, value: string): void => {
    const newDescription = [...formData.description];
    newDescription[index] = value;
    setFormData({ ...formData, description: newDescription });
  };

  const addDescriptionField = (): void => {
    setFormData({
      ...formData,
      description: [...formData.description, '']
    });
  };

  const removeDescriptionField = (index: number): void => {
    const newDescription = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: newDescription });
  };

  const handleSubmit = async () => {
    const cleanedDescription = formData.description.filter(desc => desc.trim() !== '');
    await axios.post(process.env.SERVER_URL + '/plans', {
      ...formData,
      description: cleanedDescription,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration, 10)
    })
      .then(res => {
        fetchPlans();
        onClose();
      })
      .catch(err => console.log(err));
  };

  const handleUpdate = async () => {
    const cleanedDescription = formData.description.filter(desc => desc.trim() !== '');

    const data = {
      ...formData,
      content: formData.content,
      description: cleanedDescription,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration, 10)
    }
    try {
      await fetch(process.env.SERVER_URL + '/plans/' + plan?.planId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      fetchPlans();
      onClose();
    } catch (error) {
      console.error('Error updating plan', error);

    }

  };

  return (
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {plan ? `Update the plan ${plan.category}` : 'Add a new plan'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.description.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescriptionField(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDescriptionField}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add a description
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (in month)
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>---</option>
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={12}>12</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                if (plan != null) {
                  handleUpdate();
                } else {
                  handleSubmit();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {plan ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PlanFormModal;