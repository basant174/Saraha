import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.patch(
        "/api/v1/auth/update-password",
        {
          password: formData.password,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `USER ${token}`,
          },
        }
      );

      toast.success("Password updated successfully");

      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mb-8"
    >
      <h1 className="text-2xl font-bold text-[#0d4369] mb-8">
        Update Password
      </h1>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded
           focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded
           focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded
           focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-200 text-gray-700 py-2 px-6 font-medium hover:bg-[#5b9ac7] hover:text-white transition"
        >
          {loading ? "Updating..." : "Confirm Password"}
        </button>
      </div>
    </form>
  );
}
