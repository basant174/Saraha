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
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values) => {
            let toastId = toast.loading("Logging in...");
            setApiError(null);

            try {
                const response = await axios.post("/api/v1/admin/login", values);

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
                const msg = error.response?.data?.message || "Something went wrong!";
                toast.error(msg);
                setApiError(msg);
            } finally {
                toast.dismiss(toastId);
            }
        },
    });

    return (
        <section
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: "url('../../../public/img/download.jpeg')",
                backgroundRepeat: "no-repeat"
            }}
        >
            <div className="bg-[#d0e2ef] rounded-3xl shadow-xl p-10 w-[400px] flex flex-col items-center">

                <h2 className="text-3xl font-bold text-[#082c46] mb-8">Admin Login</h2>

                <form onSubmit={formik.handleSubmit} className="w-full space-y-5">
                    <div>
                        <div className="relative w-full">
                            <i className="fa-solid pl-1 fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 px-5 py-3 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                            />
                        </div>
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <div>
                            <div className="relative w-full mt-4">
                                <i className="fa-solid pl-1 fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full pl-10 px-5 py-3 text-sm rounded-lg border-gray-200
               focus:border-[#a1c5df] focus:outline-none focus:ring-1 focus:ring-[#a1c5df]"
                                />
                            </div>
                        </div>
       
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    {apiError && (
                        <p className="text-red-400 text-sm text-center">{apiError}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#5b9ac7] hover:bg-[#448cbf] py-3 rounded-xl font-semibold text-white hover:scale-105 hover:shadow-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
}