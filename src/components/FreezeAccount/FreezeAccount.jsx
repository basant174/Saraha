import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FreezeAccount({ onFreeze }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFreeze = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/v1/user/freeze-account", {
        headers: { Authorization: `USER ${token}` },
      });

      toast.success("Account frozen successfully!");
      setShowModal(false);
      onFreeze?.(); // يحدث حالة الأب بعد الفريز
    } catch (err) {
      console.error("Error freezing account:", err);
      toast.error("Failed to freeze account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Freeze Account</h2>
        <p className="text-sm text-gray-600 mb-6">
          Freezing your account will temporarily disable your profile.
          You can reactivate it anytime by logging in again.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-md font-semibold transition-colors"
        >
          Freeze Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Freeze
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to freeze your account? This action can be undone by logging in again.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFreeze}
                disabled={loading}
                className={`py-2 px-4 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Freezing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
