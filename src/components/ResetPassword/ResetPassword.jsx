import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);
    const [email, setEmail] = useState("");

    // جلب الايميل المخزن (مثلاً من localStorage)
    useEffect(() => {
        const storedEmail = localStorage.getItem("resetEmail");
        if (!storedEmail) {
            toast.error("Email not found. Please restart the reset process.");
            navigate("/ForgetPassword"); // رجعي المستخدم للصفحة السابقة
        } else {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const passwordRegex =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    const validationSchema = object({
        otp: string().required("OTP is required"),
        password: string()
            .required("Password is required")
            .matches(
                passwordRegex,
                "Password must start with a capital letter, include a number and special character"
            ),
        confirmPassword: string()
            .oneOf([ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    async function resetPassword(values) {
        let toastId = toast.loading("Resetting password...");
        setApiError(null);

        try {
            const response = await axios.patch("/api/v1/auth/reset-password", {
                email: email, // الايميل مخزن مسبقًا
                otp: values.otp,
                password: values.password,
                confirmPassword: values.confirmPassword,
            });

            if (response.data.message?.toLowerCase().includes("success")) {
                toast.success("Password reset successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error.response);
            toast.error(
                error.response?.data?.message || "Invalid OTP or expired"
            );
        } finally {
            toast.dismiss(toastId);
        }
    }

    const formik = useFormik({
        initialValues: {
            otp: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: resetPassword,
    });

    return (
        <section className="min-h-screen bg-sky-200 flex items-center justify-center">
            <div className="bg-white w-[320px] rounded-3xl shadow-lg px-6 py-8">
                <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
                    Reset Password
                </h2>
                <p className="text-center text-sm text-gray-600 mb-4">
                    Resetting password for: <span className="font-medium">{email}</span>
                </p>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formik.values.otp}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-300"
                    />
                    {formik.errors.otp && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.otp}</p>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-300"
                    />
                    {formik.errors.password && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                    )}

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-sky-300"
                    />
                    {formik.errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                    )}

                    {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

                    <button
                        type="submit"
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-full font-medium hover:bg-sky-400 hover:text-white transition"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </section>
    );
}