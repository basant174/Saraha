import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FreezeAccount({ onFreeze }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false); 

  const handleAction = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!isFrozen) {
        //  Freeze
        await axios.delete("/api/v1/user/freeze-account", {
          headers: { Authorization: `USER ${token}` },
        });

        toast.success("Account frozen successfully!");
        setIsFrozen(true);
        onFreeze?.();
      } else {
        //  Restore
        await axios.patch(
          "/api/v1/user/restore-account",
          {},
          {
            headers: { Authorization: `USER ${token}` },
          }
        );

        toast.success("Account restored successfully!");
        setIsFrozen(false);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {isFrozen ? "Restore Account" : "Freeze Account"}
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          {isFrozen
            ? "Your account is frozen. You can restore it anytime."
            : "Freezing your account will temporarily disable your profile. You can reactivate it anytime."}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className={`py-3 px-6 rounded-md font-semibold text-white transition-colors ${
            isFrozen
              ? "bg-green-600 hover:bg-green-700"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {isFrozen ? "Restore Account" : "Freeze Account"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {isFrozen ? "Confirm Restore" : "Confirm Freeze"}
            </h3>

            <p className="text-gray-600 mb-6">
              {isFrozen
                ? "Are you sure you want to restore your account?"
                : "Are you sure you want to freeze your account?"}
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleAction}
                disabled={loading}
                className={`py-2 px-4 rounded-md text-white font-semibold transition-colors ${
                  isFrozen
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? isFrozen
                    ? "Restoring..."
                    : "Freezing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}