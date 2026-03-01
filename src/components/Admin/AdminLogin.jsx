import React, { useState } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = object({
        email: string().required("Email is required").email("Email is invalid"),
        password: string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("Submitting:", values);
            let toastId = toast.loading("Logging in...");
            setApiError(null);

            try {
                const response = await axios.post(
                    "/api/v1/admin/login",
                    values
                );

                if (response.data?.data?.creidentails?.accessToken) {
                    localStorage.setItem(
                        "adminToken",
                        response.data.data.creidentails.accessToken
                    );
                    toast.success("Logged in successfully!");
                    navigate("/admin/dashboard");
                } else {
                    toast.error("Login failed!");
                }
            } catch (error) {
                console.log("Full API Error:", error);
                console.log("Error response data:", error.response?.data);
                const msg = error.response?.data?.message || "Something went wrong!";
                toast.error(msg);
                setApiError(msg);
            } finally {
                toast.dismiss(toastId);
            }
        },
    });

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-[#b9d4e7] rounded-xl shadow-lg p-8 w-[380px]">
                <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
}