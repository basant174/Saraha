import { useFormik } from "formik";
import { object, string } from "yup";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateUser({ onSuccess }) {
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = object({
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Name is required"),
    email: string().required("Email is required").email("Email is invalid"),
    password: string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    phone: string().required("Phone is required"),
    gender: string().required("Gender is required"),
  });

  async function sendDataToSignup(values) {
    const toastId = toast.loading("Creating admin user...");
    setApiError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.post(
        "/api/v1/admin/Create-User-Admin",
        values,
        {
          headers: {
            Authorization: `ADMIN ${token}`, 
          },
        }
      );

      if (response.data.message === "User created successfully") {
        toast.success("Admin user created successfully!");
        formik.resetForm();

        if (onSuccess) {
          onSuccess(); 
        }
      }
    } catch (error) {
      const message =
        //error.response?.data?.message || "Something went wrong!";
      toast.error(message);
      setApiError(message);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
    },
    validationSchema,
    onSubmit: sendDataToSignup,
  });

  return (
    <div className="bg-[#d0e2ef] w-[350px] rounded-3xl shadow-lg px-6 py-8 relative">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
        Create User
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Admin can create a new user
      </p>

      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="flex gap-3">
          <div className="w-1/2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div className="w-1/2">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        )}

        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
        )}

        <select
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-4 py-2.5 text-sm rounded-lg border focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        {formik.touched.gender && formik.errors.gender && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.gender}</p>
        )}

        {apiError && (
          <p className="text-red-500 text-sm text-center">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-white text-gray-700 py-2 rounded-full font-medium hover:bg-[#2c7db7] hover:text-white transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}