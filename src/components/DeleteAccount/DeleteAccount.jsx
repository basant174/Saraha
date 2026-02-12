import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeleteAccount({ isFrozen }) {
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    // لو الحساب مش متجمد، نطلع تحذير
    if (!isFrozen) {
      toast.error("You must freeze your account before deleting it.");
      setShowModal(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/v1/user/delete-account", {
        headers: { Authorization: `USER ${token}` },
      });

      toast.success("Account deleted successfully!");
      setShowModal(false);

      // Redirect بعد الحذف
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // 2 ثانية تأخير
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delete Account</h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone. You must freeze your account first.
        </p>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            checked={isDeleteConfirmed}
            onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I understand that all my data will be permanently deleted.
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!isDeleteConfirmed || loading}
          className={`py-3 px-6 rounded-md font-semibold transition-colors ${
            isDeleteConfirmed
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-red-600 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className={`py-2 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
