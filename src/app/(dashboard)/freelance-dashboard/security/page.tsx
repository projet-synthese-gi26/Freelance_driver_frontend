"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/service/apiClient";

const Page = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password confirmation does not match.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.put("/api/v1/users/password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Update your password using your current credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
